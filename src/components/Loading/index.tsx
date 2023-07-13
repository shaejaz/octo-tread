import { useTheme } from '@mui/material'

interface Props {
  width?: number
  height?: number
}

export const Loading = (props: Props) => {
  const theme = useTheme()

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '75px'}
      height={props.height || '75px'}
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
    >
      <g transform='rotate(0 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-1.09375s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(45 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.9375s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(90 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.78125s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(135 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.625s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(180 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.46875s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(225 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.3125s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(270 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='-0.15625s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
      <g transform='rotate(315 50 50)'>
        <rect
          x='45'
          y='17.5'
          rx='3'
          ry='3'
          width='10'
          height='15'
          fill={theme.palette.primary.main}
        >
          <animate
            attributeName='opacity'
            values='1;0'
            keyTimes='0;1'
            dur='1.25s'
            begin='0s'
            repeatCount='indefinite'
          ></animate>
        </rect>
      </g>
    </svg>
  )
}
