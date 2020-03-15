# Opera Timeline

An interactive timeline visualization of projects related to the Opera of the Future at the MIT Media Lab. 

## Dev Dependencies 

Requires a recent version of node.js that supports es6 module `import` and `export` syntax.

```bash
git clone git@github.com:mitmedialab/opera-timeline.git
npm install
npm run develop
```

1. Navigate to `127.0.0.1:9090`
1. Add an entry to src/opera.yaml
1. Wait for two seconds while the `develop` script re-builds the app
1. Reload your browser to see the updated content 

## YAML content spec

Examples:

```yaml
Maybellene:
  date: 1955-5
  tags: [rock-and-roll, epochal, african-american]
  detail: 'Chuck Berry released this genre-defining song in May of 1955'
  audio:
    url: audio/1955 - Meybellene.m4a
  image:
    url: img/chuck-berry-1957.jpg
    source: https://commons.wikimedia.org/wiki/File:Chuck_Berry_1957.jpg
    caption: Promotional photo of Chuck Berry from 1957

Powers of Ten:
  p: 5
  date: 1977
  links:
    - url: https://www.youtube.com/watch?v=0fKBhvDjuy0
      text: YouTube
  detail: |
    This educational video portrays 40 orders of magnitude of physical scale.
    It was selected for inclusion in the Library of Congress archives for being
    “culturally, historically, or aesthetically significant.”
  video:
    url: video/1977 - Powers of Ten.webm
    publishable: library of congress
    startTime: 24
```

Notes:

- `audio` and `video` fields can have a `startTime` sub-field, which offsets the beginning of the media content in seconds 
- `date` can have several levels of precision
  - `1990` year
  - `1990-2` month
  - `1990-2-30` day
- `p` is the *priority*, and should always be a number. When two events overlap
  on the timeline, if one has a higher priority, that event will be shown, and
  the overlapping event will be hidden.