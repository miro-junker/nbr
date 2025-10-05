import GaugeComponent from 'react-gauge-component'
import './Gauges.css'


export const Gauges = () => {
  return (
    <>
        <div className='gauge gauge--fuel'>
          <div className='gauge__label'>FUEL</div>
          <GaugeComponent
            value={40}
            labels={{valueLabel: {hide: true}, tickLabels: {hideMinMax: true}}}
            type='semicircle'
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              colorArray: ['#ef4444', 'black'],
              subArcs: [{limit: 10, showTick: false}, {}]
            }}
            pointer={{color: '#00FF00', type: 'arrow'}}
          />
        </div>
    </>
  )
}
