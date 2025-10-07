import GaugeComponent from 'react-gauge-component'
import type { TAppState } from '@/types'
import { SPEED_MIN, SPEED_MAX } from '@/config/game'
import { GAUGE_LOW_FUEL, GAUGE_HIGH_SPEED } from '@/config/render'
import './Gauges.css'


interface Props {
    appState: TAppState
}


export const Gauges = ({ appState: { fuel, speed } }: Props) => {
    const HIGH_SPEED_ARC = ((SPEED_MAX - SPEED_MIN) * GAUGE_HIGH_SPEED) + SPEED_MIN

    const baseArcStyle = {
        width: 0.2,
        padding: 0.005,
        cornerRadius: 1,
    }

    return (
        <>
            <div className='gauge gauge--fuel'>
                <div className='gauge__label'>FUEL</div>
                <GaugeComponent
                    minValue={0}
                    maxValue={1}
                    value={fuel}
                    type='semicircle'
                    labels={{
                        valueLabel: { hide: true },
                        tickLabels: { hideMinMax: true },
                    }}
                    arc={{
                        ...baseArcStyle,
                        colorArray: ['#ef4444', '#111'],
                        subArcs: [{ limit: GAUGE_LOW_FUEL, showTick: false }, {}],
                    }}
                    pointer={{ color: '#00FF00', type: 'arrow' }}
                />
            </div>

            <div className='gauge gauge--speed'>
                <div className='gauge__label'>SPEED</div>
                <GaugeComponent
                    minValue={1}
                    maxValue={SPEED_MAX}
                    value={speed}
                    type='semicircle'
                    labels={{
                        valueLabel: { hide: true },
                        tickLabels: { hideMinMax: true },
                    }}
                    arc={{
                        ...baseArcStyle,
                        colorArray: ['#111', '#ef4444'],
                        subArcs: [{ limit: HIGH_SPEED_ARC, showTick: false }, {}],
                    }}
                    pointer={{ color: '#00FF00', type: 'arrow' }}
                />
            </div>
        </>
    )
}
