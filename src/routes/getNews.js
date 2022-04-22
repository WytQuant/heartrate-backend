const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url =
      "https://www.verywellfit.com/nutrition-and-fitness-news-4844931";
    const data = await axios.get(url);
    if (data.status !== 200) {
      return res.status(data.status).send({
        message: "Invalid url",
      });
    }

    const html = await data.data;
    const $ = cheerio.load(html);

    const listArticles = $("#mntl-taxonomysc-article-list_1-0 a");
    const articles = [];

    listArticles.each((idx, el) => {
      const title = $(el)
        .find("div.card__content > span.card__title > span.card__title-text")
        .text()
        .trim();

      const imageUrl = $(el)
        .find("div.card__media > img")
        .attr("data-src")
        .trim();

      const imgAlt = $(el).find("div.card__media > img").attr("alt").trim();

      const url = $(el).attr("href").trim();

      articles.push({
        title,
        imageUrl,
        imgAlt,
        url,
      });
    });

    const listSpotlightArticles = $("#mntl-document-spotlight_1-0 a");
    const spotlightarticles = [];

    listSpotlightArticles.each((idx, el) => {
      const title = $(el)
        .find("div.card__content > span.card__title > span.card__title-text")
        .text()
        .trim();

      const imageUrl = $(el)
        .find("div.card__media > img")
        .attr("data-src")
        .trim();

      const imgAlt = $(el).find("div.card__media > img").attr("alt").trim();

      const url = $(el).attr("href").trim();

      spotlightarticles.push({
        title,
        imageUrl,
        imgAlt,
        url,
      });
    });

    return res.status(200).send({ spotlightarticles, articles });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
