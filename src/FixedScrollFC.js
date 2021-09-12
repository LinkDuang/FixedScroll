import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react'
import './style.css'

const getTopPer = (e, height) => {
  let dom = e.target.documentElement
  // let distance = dom.scrollTop;
  let containerCut = height - dom.clientHeight
  // console.log('e', e)

  // 声明 DTD：
  let p = dom.scrollTop / containerCut
  // 未声明 DTD：
  // let p = document.body.scrollTop / containerCut
  if (p >= 1) {
    p = 1
  }
  return p
}

const range = (number, length) => {
  let list = []
  let i = 1
  while (i <= number) {
    list.push({
      id: `FS-step${i}`,
      height: length / number,
    })
    i += 1
  }
  return list
}

const FixedScroll = (props, ref) => {
  // let { height, slice } = props

  const [step, setStep] = useState(1)
  const [percentageTop, setPercentageTop] = useState(0)

  // 主要作用：
  // 1，传入一个固定高度和分片数量
  // 2，自动切分出多个滚动组件
  // 3，暴露一组属性、方法让外部可获取内部 Value

  useImperativeHandle(ref, () => {
    return { percentageTop: percentageTop }
  })

  useEffect(() => {
    const onScroll = (e) => {
      let p = getTopPer(e, props.height)
      // console.log('距离顶部百分比', p)
      let yiff = 1 / props.contents.length // 一份
      let ff = Math.ceil(p / yiff) // 向上取整
      setStep(ff === 0 ? 1 : ff) // 但 0 就视为 1
      setPercentageTop(p)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [step])

  // let guideScrollTo = (target) => {
  //   setCanScroll(true)
  //   setTimeout(() => {
  //     let anchorElement = document.getElementById(target)
  //     if (anchorElement) {
  //       anchorElement.scrollIntoView({ behavior: 'smooth' })
  //     }
  //   }, 200)
  // }

  return (
    <div className='FS-container'>
      <div className='FS-background-container' style={{ height: props.height }}>
        {range(props.contents.length, props.height).map((i) => {
          return <div id={i.id} key={i.id} style={{ height: i.height }}></div>
        })}
        <div className='FS-left'></div>
        <div className='FS-right'></div>
      </div>

      {/* 前景，相当于给一个 abslute */}
      <div className='FS-foreground-container'>
        {props.contents.map((con, index) => {
          let none = step !== index + 1 ? ' FS-none ' : ''
          return (
            <div key={index} className={'FS-foreground-item' + none}>
              {con}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default forwardRef(FixedScroll)
