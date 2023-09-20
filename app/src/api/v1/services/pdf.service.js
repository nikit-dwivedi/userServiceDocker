const fs = require('fs');
const { get } = require('./axios.service');
const { DownloaderHelper } = require('node-downloader-helper');

exports.downloadFile = async function (downloadUrl, sellerName) {
    try {
        // const response = await get(downloadUrl);
        // console.log(response);
        // const writer = fs.writeFileSync("contract/" + sellerName + "_contract.pdf",response.data);
        // console.log(writer);
        const download = new DownloaderHelper(downloadUrl, __dirname + "/contract", { fileName: sellerName.replaceAll(" ", "_") + "_contract.pdf" });
        download.start();
        return new Promise((resolve, reject) => {
            download.on('end', (data) => resolve(data))
            // writer.on('finish', resolve(writer));
            download.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error('Error downloading the file:', error);
        throw error;
    }
}