import { GTCRFactory, GeneralizedTCR } from "@kleros/gtcr-sdk";

class GTCRService {
    gtcrFactory = null
    // mainnet
    // GTCR_VIEW_ADDRESS = "0x98f1309f96044000174a89c2a0e2001ea5d7a524";
    // GTCR_VIEW_ADDRESS = "0x31e8d06b5fc3856cc93f4172d335626c680af1a7";

    // kovan
    GTCR_VIEW_ADDRESS = "0x48ea7987bb7c839cc68aaf0b800aa615e8e7ba96";
    
    IPFS_GATEWAY = "https://ipfs.kleros.io";
    // mainnet
    // LIST_ADDRESS = "0x2E3B10aBf091cdc53cC892A50daBDb432e220398";
    // LIST_ADDRESS = "0x089D86D56C1Cae8F8dCfCBa722a3123Be112f9ce";

    // kovan
    LIST_ADDRESS = "0x089D86D56C1Cae8F8dCfCBa722a3123Be112f9ce";
    // LIST_ADDRESS = "0x0eeB33f579C543A199ECc5c658DC0d1a74F2306F";
    
    
    DEPLOYMENT_BLOCK = 22093223 ; // Optional, but recommended. Setting the deployment block speeds up requests.

    constructor() {
        console.log("create")
        this.gtcrFactory = new GTCRFactory(
            window.ethereum,
            // mainnet
            // "0xe9dd523600b74b8ef0af164687079a6c437f9cd5"
            // "0xcc1f0ca49a9d622da624bff6a4cd5b32c5276b11"
            // kovan
            "0x4296b39059b8591d4f22a0fc4ee49508279b8fc6"
          );
        
    }

    async getItems() {
        const gtcr = new GeneralizedTCR(
            window.ethereum,
            this.LIST_ADDRESS,
            this.GTCR_VIEW_ADDRESS,
            this.IPFS_GATEWAY,
            this.DEPLOYMENT_BLOCK
        );
        // console.log(await gtcr.getLatestMetaEvidence())
        // const item = await gtcr.getItem("0x08d159a68ae09674f65a464b6ec0f275f362592094734e4accc012084fc978dc")
        // console.info(items.map(item => item.decodedData))
        // console.log(item.decodedData)
        
        // console.log(this.LIST_ADDRESS, this.GTCR_VIEW_ADDRESS)
        // console.info(await this.gtcrFactory.getTCRAddresses());
            
        const items = await gtcr.getItems()
        // console.log(items)
        console.info(items.map(item => item.decodedData))

    }
}
  
export default new GTCRService();
  
  