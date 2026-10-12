import { processWave } from './processor.js';

self.onmessage = async ({data}) => {
  try {
    const {wav,report} = await processWave(data.buffer,data.options,stage=>self.postMessage({type:'progress',stage}));
    self.postMessage({type:'done',wav,report},[wav]);
  } catch(error) {
    self.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});
  }
};
