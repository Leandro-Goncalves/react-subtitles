<p align="center">
  <img src=".github/assets/reactSubtitiles.png" height="150" width="175" alt="React subtitles" />
</p>

<p align="center">A react library for parse subtitle files</p>

[![NPM](https://img.shields.io/npm/v/react-subtitles.svg)](https://www.npmjs.com/package/react-subtitles) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com

## Install

```bash
npm install --save react-subtitles
  #or
yarn add react-subtitles
```

## Usage

```tsx
import React from 'react'

import useSubtitles from 'react-subtitles'

export default function App() {

   const subtitlesUrl = "https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt"

  const [subtitle] = useSubtitles({subtitles:subtitlesUrl})
  return(
    <>
      {subtitle.map(s => <h1>{s.text}</h1>)}
    </>
  )
}
```

## License

MIT © [Leandro-Goncalves](https://github.com/Leandro-Goncalves)
