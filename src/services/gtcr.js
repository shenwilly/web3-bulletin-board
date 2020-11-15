import { GeneralizedTCR } from "@kleros/gtcr-sdk";
import { ethers } from "ethers";
import gtcrAbi from '@/abis/GeneralizedTCR.json';
import { gtcrEncode } from '@/utils/encoder';

import {
    GTCR_VIEW_ADDRESS, 
    IPFS_GATEWAY,
    MODERATOR_TCR_ADDRESS,
    BLOCKED_POSTS_TCR_ADDRESS,
    MODERATOR_TCR_DEPLOYMENT_BLOCK,
    BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
} from '@/env';

class GTCRService {
    moderatorGTCR = new GeneralizedTCR(
        window.ethereum,
        MODERATOR_TCR_ADDRESS,
        GTCR_VIEW_ADDRESS,
        IPFS_GATEWAY,
        MODERATOR_TCR_DEPLOYMENT_BLOCK
    );

    postGTCR = new GeneralizedTCR(
        window.ethereum,
        BLOCKED_POSTS_TCR_ADDRESS,
        GTCR_VIEW_ADDRESS,
        IPFS_GATEWAY,
        BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
    );
    // kovan
    // GTCR_VIEW_ADDRESS = "0x48ea7987bb7c839cc68aaf0b800aa615e8e7ba96";
    
    // IPFS_GATEWAY = "https://ipfs.kleros.io";

    // MODERATOR_TCR_ADDRESS = "0x089D86D56C1Cae8F8dCfCBa722a3123Be112f9ce";
    // BLOCKED_POSTS_TCR_ADDRESS = "0xa1e686E44f7Eccb2A4876ADddE10dc0796778D7f";    
    
    // MODERATOR_TCR_DEPLOYMENT_BLOCK = 22093223
    // BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK = 22111416
    async fetchPostMetaEvidence() {
        return await this.postGTCR.getLatestMetaEvidence()
    }

    async fetchChallengePeriodDuration() {
        return await this.postGTCR.challengePeriodDuration()
    }

    async fetchModerators() {
        const items = await this.moderatorGTCR.getItems()
        return items
            .filter(item => item.status == 1)
            .map(item => item.decodedData[0])
    }

    async fetchBlockedPosts() {
        // const postGTCR = new GeneralizedTCR(
        //     window.ethereum,
        //     BLOCKED_POSTS_TCR_ADDRESS,
        //     GTCR_VIEW_ADDRESS,
        //     IPFS_GATEWAY,
        //     BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
        // );
        // console.log(await postGTCR.getLatestMetaEvidence(), "metaevidence")
            
        const items = await this.postGTCR.getItems()
        // items.forEach(item => {
        //     console.log(item.decodedData, "blockedPost", item['11'])
        // })
        return items
            .filter(item => item.status == 1)
            .map(item => item.decodedData[0])
    }

    async fetchReportedItems(address) {
        // const postGTCR = new GeneralizedTCR(
        //     window.ethereum,
        //     BLOCKED_POSTS_TCR_ADDRESS,
        //     GTCR_VIEW_ADDRESS,
        //     IPFS_GATEWAY,
        //     BLOCKED_POSTS_TCR_DEPLOYMENT_BLOCK
        // );
            
        const items = await this.postGTCR.getItems()
        // items.forEach(item => {
        //     console.log(item.decodedData, "blockedPost", item['11'])
        // })
        // console.log(items)
        // console.log(items.filter(item => item['11'].toLowerCase() == address.toLowerCase()))
        return items.filter(item => item['11'].toLowerCase() == address.toLowerCase())
            // .map(item => item.decodedData[0])
    }

    async reportPost(postId) {
        // console.log(postId);

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(
            BLOCKED_POSTS_TCR_ADDRESS, gtcrAbi, provider);

        const contractWithSigner = contract.connect(signer);

        const metaEvidence = await this.postGTCR.getLatestMetaEvidence()
        const encodedParams = gtcrEncode({
            columns: metaEvidence[0].metadata.columns,
            values: {PostID: postId}
        })
        // console.log(encodedParams, "<<?")
        const baseDeposit = await contract.submissionBaseDeposit()
        let baseDepositEther = parseFloat(ethers.utils.formatEther(baseDeposit))
        baseDepositEther += 0.03 // TODO: TEMP HARD CODED JUROR FEE
        
        const tx = await contractWithSigner.addItem(encodedParams, {
            // value: ethers.utils.parseEther(baseDepositEther),
            value: ethers.utils.parseEther(baseDepositEther.toString()),
          })
        console.log(tx, "<<<")
    }
}
  
export default new GTCRService();
  
  