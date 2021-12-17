<script lang="ts">
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { useNavigate } from 'svelte-navigator';
  import { base64url } from 'rfc4648';
  import { SiweMessage } from 'siwe';
  import { S3, siweAuthenticator, startSIWESession } from 'kepler-sdk';
  import { providers } from "ethers";
  import {
    files,
    fetchAllUris,
    keplerUrls,
    FileListEntry,
  } from 'src/store';
 import { Button } from 'components';

 export let authz: string;
 export let key: string;
 const authStr = new TextDecoder().decode(base64url.parse(authz));
 let blob = null;

 const download = async () => {
     // determine auth scenario
     if (typeof authz !== 'string') {
         return;
     }

     const [token, sig]: [string, string] = JSON.parse(authStr);

     const siwe = new SiweMessage(token);
     siwe.signature = sig;

     // roughly extract the oid from the first resource, kind of a hack
     const oid = siwe.resources[0]?.split("/")[2];

    // @ts-ignore
     const signer = new providers.Web3Provider(window.ethereum).getSigner();
     const authn = await siweAuthenticator(signer, window.location.hostname, "1", siwe);
     const s3 = new S3(
       keplerUrls[0],
       oid,
       authn
     );

     const res = await s3.get(key);
     if (res.status !== 200) {
         throw new Error(await res.text())
     }
     blob = URL.createObjectURL(await res.blob());
 }

</script>

<div>
{#if blob}
    <a href={blob} download={key}>Save: {key}</a>
{:else}
    <Button text={`Authenticate to Download ${key}`} onClick={download} mini class="w-full uppercase"/>
{/if}
</div>
