import GaugeComponent from 'react-gauge-component'
import type { TAppState } from '@/types'
import './Gauges.css'


interface Props {
    appState: TAppState
}


export const Gauges = ({ appState: { fuel, speed } }: Props) => {
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
                    value={fuel}
                    labels={{
                        valueLabel: { hide: true },
                        tickLabels: { hideMinMax: true },
                    }}
                    type='semicircle'
                    arc={{
                        ...baseArcStyle,
                        colorArray: ['#ef4444', '#111'],
                        subArcs: [{ limit: 10, showTick: false }, {}],
                    }}
                    pointer={{ color: '#00FF00', type: 'arrow' }}
                />
            </div>

            <div className='gauge gauge--speed'>
                <div className='gauge__label'>SPEED</div>
                <GaugeComponent
                    value={speed}
                    labels={{
                        valueLabel: { hide: true },
                        tickLabels: { hideMinMax: true },
                    }}
                    type='semicircle'
                    arc={{
                        ...baseArcStyle,
                        colorArray: ['#111', '#ef4444'],
                        subArcs: [{ limit: 75, showTick: false }, {}],
                    }}
                    pointer={{ color: '#00FF00', type: 'arrow' }}
                />
            </div>
        </>
    )
}
