import marked from 'marked';

// Links should open in a new tab. Implementation comes from here:
// https://github.com/markedjs/marked/pull/1371#issuecomment-434320596
var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.apply(this, arguments);
    return link.replace("<a","<a target='_blank'");
};
marked.setOptions({ renderer: renderer });


/**
 * Generates `.html` fields for raw timeline data. This should be called by
 * rollup in the build stage of your timeline application.
 *
 * Timeline Events typically go through two stages of processing before they can
 * be rendered. This is the first stage, and is designed to be called during the
 * build process (not in the browser). As such, all input and output data must
 * be JSON serializable.
 *
 * Each event in the array returned by this method will have a `.html` field,
 * which is generated from the and `.details` markdown field in conjunction with
 * any `.audio`, `.video`,  `.image.url` fields.
 *
 * If node.js' process.env.BUILD environment variable is `public`, the output
 * data will also be stripped of any `.audio` and `.video` objects that do not
 * have a truthy `.publishable` field. This allows you to maintain separate
 * builds that omit copyrighted content, in the event that you are publishing
 * to the web.
 *
 * @param {Object} data A json serializable object typically read from a JSON
 *   or YAML file. Each entry in the object should represent one timeline event.
 * @returns {Object} A JSON serializable object wherein each entry represents
 *   timeline event. This will be the same object that was passed in, albeit
 *   with mutated fields.
 */
export function populateHtmlFields(data) {
  if (Array.isArray(data))
    throw new Error('populate html fields expects an object, not an array');

  for (const [title, obj] of Object.entries(data)) {
    // remove and video that is not publishable (possibly due to copyright)
    if (process.env.BUILD === 'public') {
      if (obj.video && !obj.video.publishable) delete obj.video;
      if (obj.audio && !obj.audio.publishable) delete obj.audio;
    }

    const videoUrl = (obj.video && obj.video.url) || null;
    const audioUrl = (obj.audio && obj.audio.url) || null;
    const imageUrl = (obj.image && obj.image.url) || obj.imageURL || null;
    if (!obj.html)    obj.html = '';

    // CAREFUL: Look at this flippant server side unsafeness. I'm not planning
    // on adding any ability for users to submit strings, but if I do these un-
    // escaped strings will need to be sanitized.
    //
    // encodeURI() escapes double quotes, but not single quotes
    if (imageUrl) obj.html += `<img src="${encodeURI(imageUrl)}"/>`;
    if (obj.detail) obj.html += marked(obj.detail);
  }
  return data;
}