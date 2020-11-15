import { GeneralizedTCR } from "@kleros/gtcr-sdk";
import { ethers } from "ethers";
import gtcrAbi from '@/abis/GeneralizedTCR.json';
import { gtcrEncode } from '@/utils/encoder'

class GTCRService {
    // gtcrFactory = null
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
    MODERATOR_TCR_ADDRESS = "0x089D86D56C1Cae8F8dCfCBa722a3123Be112f9ce";
    BLOCKED_POSTS_TCR_ADDRESS = "0xa1e686E44f7Eccb2A4876ADddE10dc0796778D7f";
    // LIST_ADDRESS = "0x0eeB33f579C543A199ECc5c658DC0d1a74F2306F";
    
    
    MODERATOR_TCR_DEPLOYMENT_BLOCK = 22093223 ; // Optional, but recommended. Setting the deployment block speeds up requests.
    BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK = 22111416 ; // Optional, but recommended. Setting the deployment block speeds up requests.

    // constructor() {
    //     console.log("create")
    //     this.gtcrFactory = new GTCRFactory(
    //         window.ethereum,
    //         // mainnet
    //         // "0xe9dd523600b74b8ef0af164687079a6c437f9cd5"
    //         // "0xcc1f0ca49a9d622da624bff6a4cd5b32c5276b11"
    //         // kovan
    //         "0x4296b39059b8591d4f22a0fc4ee49508279b8fc6"
    //       );
    // }

    async fetchModerators() {
        const moderatorGTCR = new GeneralizedTCR(
            window.ethereum,
            this.MODERATOR_TCR_ADDRESS,
            this.GTCR_VIEW_ADDRESS,
            this.IPFS_GATEWAY,
            this.MODERATOR_TCR_DEPLOYMENT_BLOCK
        );
        
        const items = await moderatorGTCR.getItems()
        // console.log(items)
        return items
            .filter(item => item.status == 1)
            .map(item => item.decodedData[0])
    }

    async fetchBlockedPosts() {
        const postGTCR = new GeneralizedTCR(
            window.ethereum,
            this.BLOCKED_POSTS_TCR_ADDRESS,
            this.GTCR_VIEW_ADDRESS,
            this.IPFS_GATEWAY,
            this.BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
        );

        // console.log(await postGTCR.getLatestMetaEvidence())
            
        const items = await postGTCR.getItems()
        items.forEach(item => {
            console.log(item.decodedData, "blockedPost", item)
        })
        return items
            .filter(item => item.status == 1)
            .map(item => item.decodedData[0])
    }

    async reportPost(postId) {
        console.log(postId);

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(
            this.BLOCKED_POSTS_TCR_ADDRESS, gtcrAbi, provider);
        // console.log(contract, "<<")
        
        // console.log(contract.arbitrator())

        const contractWithSigner = contract.connect(signer);
        // const tx = await contractWithSigner.addItem
        const postGTCR = new GeneralizedTCR(
            window.ethereum,
            this.BLOCKED_POSTS_TCR_ADDRESS,
            this.GTCR_VIEW_ADDRESS,
            this.IPFS_GATEWAY,
            this.BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
        );
        const metaEvidence = await postGTCR.getLatestMetaEvidence()
        console.log(metaEvidence[0])
        const encodedParams = gtcrEncode({
            columns: metaEvidence[0].metadata.columns,
            values: {PostID: postId}
        })
        console.log(encodedParams, "<<?")
        const tx = await contractWithSigner.addItem(encodedParams, {
            value: ethers.utils.parseEther("0.03"),
            // gasLimit
          })
        console.log(tx, "<<<")

        
    }
}
  
export default new GTCRService();
  
  