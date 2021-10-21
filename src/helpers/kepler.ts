import { Kepler, S3 } from 'kepler-sdk';

export const addToKepler = async (
  kepler: S3,
  key: string,
  obj: Blob
) => {
  // obj.forEach((o) => console.log(o));
  if (kepler) {
    // Get around the error of possibly passing nothing.
    const res = await kepler.put(key, obj, {});
    console.log('RES', res);
    if (!res.ok || res.status !== 200) {
      throw new Error(`Failed to save object: ${res.statusText}`);
    }
  } else {
    throw new Error('No Kepler integration found');
  }
};

// export const saveToKepler = async (
//   kepler: Kepler,
//   orbit: string,
//   ...obj: Array<any>
// ) => {
//   obj.forEach((o) => console.log(o));
//   if (kepler) {
//     // Get around the error of possibly passing nothing.
//     let f = obj.pop();
//     if (!f) {
//       throw new Error('Empty array passed to saveToKepler');
//     }

//     try {
//       const res = await kepler.createOrbit(f, ...obj);
//       if (!res.ok || res.status !== 200) {
//         throw new Error(`Failed to create orbit: ${res.statusText}`);
//       }
//       const addresses = await res.text();

//       return addresses.split('\n');
//     } catch (e) {
//       console.warn(
//         `Failed in create new orbit with error: ${e?.message || JSON.stringify(e)
//         }`
//       );
//       console.warn('Trying existing orbit');
//       try {
//         return await addToKepler(kepler, orbit, ...[f, ...obj]);
//       } catch (err) {
//         throw err;
//       }
//     }
//   }

//   throw new Error('No Kepler integration found');
// };

export const removeFromKepler = async (
  kepler: S3,
  key: string,
) => {
  if (kepler) {
    const res = await kepler.del(key);
    console.log('RES', res);
    if (!res.ok || res.status !== 200) {
      throw new Error(`Failed to remove object: ${res.statusText}`);
    }
  } else {
    throw new Error('No Kepler integration found');
  }
};
