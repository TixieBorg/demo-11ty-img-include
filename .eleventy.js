
const EleventyImg = require("@11ty/eleventy-img");

async function postImageShortcode(src, alt) {
	if(alt === undefined) {
	  // You bet we throw an error on missing alt (alt="" works okay)
	  throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
	}

	let metadata = await EleventyImg(src, {
		widths: [184,308,616],
		formats: ['avif', 'webp', 'jpeg'],
    outputDir: './_site/img/'
	  });

	  let lowsrc = metadata.jpeg[0];
	  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

	  return `<picture>
		${Object.values(metadata).map(imageFormat => {
		  return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}">`;
		}).join("\n")}
		  <img
      style="max-width: 100%; height: auto;"
			src="${lowsrc.url}"
			width="${highsrc.width}"
			height="${highsrc.height}"
			alt="${alt}"
			loading="lazy"
			decoding="async">
		</picture>`;
  }


module.exports = function(eleventyConfig) {

  eleventyConfig.addNunjucksAsyncShortcode("postImage", postImageShortcode);

	eleventyConfig.addCollection("posts", function (collectionApi) {
		return collectionApi.getFilteredByGlob("posts/*.md");
	});

  return
};
