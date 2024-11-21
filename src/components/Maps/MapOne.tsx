import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/css/jsvectormap.css';
import { useEffect } from 'react';
import '../../js/us-aea-en';

const MapOne = () => {
  useEffect(() => {
    const mapOne = new jsVectorMap({
      selector: '#mapOne',
      map: 'gh',
      zoomButtons: true,

      regionStyle: {
        initial: {
          fill: '#007256',
        },
        hover: {
          fillOpacity: 1,
          fill: '#007256',
        },
      },
      regionLabelStyle: {
        initial: {
          fontFamily: 'Satoshi',
          fontWeight: 'semibold',
          fill: '#fff',
        },
        hover: {
          cursor: 'pointer',
        },
      },

      labels: {
        regions: {
          render(code: string) {
            return code.split('-')[1];
          },
        },
      },
    });
    mapOne;
  });

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div id="mapOne" className="mapOne map-btn h-90"></div>
    </div>
  );
};

export default MapOne;
