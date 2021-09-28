import React, { useState } from 'react'

import useLegends from 'react-subtitles'
import 'react-subtitles/dist/index.css'

const App = () => {

  const subtitlesUrl = "https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt"

  const [videoTime, setVideoTime] = useState(0)
  const [subtitle] = useLegends({subtitles:subtitlesUrl, videoTime})

  return (
    <>
      <video
         onTimeUpdate={(f) => setVideoTime(f.currentTarget.currentTime)}
         controls
         src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
      />
      {subtitle.map(s => <h1>{s.text}</h1>)}
    </>
  )
}

export default App
