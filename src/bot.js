const Twit = require("twit");
const puppeteer = require("puppeteer");
const config = require("./config");

const bot = new Twit(config);

const screenshot = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto("https://ajrussellaudio.github.io/wyoming/");
  const canvas = await page.$("#sketch");
  await canvas.screenshot({ path: "img.jpg", quality: 80 });
  uploadMedia();
  await browser.close();
};

const uploadMedia = () => {
  bot.postMediaChunked({ file_path: "img.jpg" }, (err, data) => {
    if (err) {
      console.log("ERROR:", err);
    } else {
      const params = {
        status: "",
        media_ids: data.media_id_string
      };
      postStatus(params);
    }
  });
};

const postStatus = params => {
  bot.post("statuses/update", params, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Image tweeted!`);
    }
  });
};

module.exports = screenshot;
