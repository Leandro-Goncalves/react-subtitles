import { useEffect, useMemo, useState } from 'react'

type vtt = {
  start: number
  stop: number
  text: string
  author?: string
}

type useSubtitlesProps = {
  subtitles: string
  videoTime?: number
}

type Options = {
  isLoading: boolean
  isError: boolean
}

type useSubtitlesReturn = [vtt[], Options]

type SelectCurrentSubtitleProps = {
  subtitle: vtt[]
  videoTime?: number
}

const useSubtitles = ({
  subtitles,
  videoTime
}: useSubtitlesProps): useSubtitlesReturn => {
  const [value, setValue] = useState<vtt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const FetchVtt = useMemo(
    () =>
      fetch(subtitles).then((res) => {
        if (res.ok) {
          return res.text()
        } else {
          setIsError(true)
          return null
        }
      }),
    [subtitles]
  )

  useEffect(() => {
    setIsLoading(true)
    FetchVtt.then((vtt) => {
      if (!vtt) {
        return
      }
      if (!checkVtt(vtt)) {
        return
      }
      const subtitle = LoadVtt(vtt)

      const newsubtitle = splitStubtitleAndAuthor(subtitle)
      const currentSubtitle = SelectCurrentSubtitle({
        subtitle: newsubtitle,
        videoTime
      })
      if (JSON.stringify(currentSubtitle) === JSON.stringify(value)) {
        return
      }

      setValue(currentSubtitle)
      setIsLoading(false)
    })
  }, [videoTime, FetchVtt, value])

  return [value, { isLoading, isError }]
}

export function checkVtt(vtt: string): boolean {
  return /^WEBVTT/g.test(vtt)
}

export function LoadVtt(vtt: string): vtt[] {
  const divideBlocks = /((?:^[0-9])+(?:.|\n.|\r\n.)+)/gm
  const divideTextToTimestamp =
    /((?:[0-9]|:|\..)+) --> ((?:[0-9]|:|\.)+)(?:.*)(?:\n|\r\n)((?:.|\n.|\r\n.)+)/gm
  const blocks = vtt.match(divideBlocks)

  if (!blocks) {
    return []
  }

  const editedSubtitle = blocks.map((block) => {
    const subtitle = block.matchAll(divideTextToTimestamp).next().value
    return {
      start: Number(subtitle[1].replace(/(:|\.)/g, '')) / 1000,
      stop: Number(subtitle[2].replace(/(:|\.)/g, '')) / 1000,
      text: subtitle[3]
    }
  })

  if (!editedSubtitle) {
    return []
  }

  return editedSubtitle
}

export function splitStubtitleAndAuthor(subtitles: vtt[]) {
  return subtitles.map((subtitle) => {
    const textSplit = subtitle.text.split(/<v (.*)>/g)
    if (textSplit.length === 3) {
      // have author
      return { ...subtitle, text: textSplit[1], author: textSplit[2] }
    }
    return subtitle
  })
}

export function SelectCurrentSubtitle({
  subtitle,
  videoTime
}: SelectCurrentSubtitleProps): vtt[] {
  if (!subtitle) {
    return []
  }

  if (videoTime === undefined) {
    return subtitle
  }

  const currentSubtitle = subtitle.filter(
    (subtitle) => videoTime > subtitle.start && videoTime < subtitle.stop
  )

  if (!currentSubtitle) {
    return []
  }
  return currentSubtitle
}

export default useSubtitles
