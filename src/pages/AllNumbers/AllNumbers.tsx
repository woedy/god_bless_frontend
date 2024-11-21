import { useCallback, useEffect, useState } from 'react';
import {
  baseUrl,
  baseUrlMedia,
  truncateText,
  userToken,
} from '../../constants';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Alert2 from '../UiElements/Alert2';
import ClearConfirmationModal from '../../components/ClearConfirmationModal';

const AllNumbers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [date, setElectionYear] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Default to 1 to avoid issues
  const [loading, setLoading] = useState(false);

  // State for delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // State for alerts
  const [alert, setAlert] = useState({ message: '', type: '' });


  const [error, setError] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}api/phone-generator/list-numbers/?search=${encodeURIComponent(
          search,
        )}&page=${page}&date=${date}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${userToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setNumbers(data.data.numbers);
      setTotalPages(data.data.pagination.total_pages);
      setItemCount(data.data.pagination.count);
      console.log('Total Pages:', data.data.pagination.total_pages);
      console.log('ppp:', data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, page, date, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateNumbers = async () => {
    setLoading(true);
    setError(null);
    setValidationMessage('');


    try {
      const response = await fetch(`${baseUrl}api/phone-validator/start-validation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to validate the item');
      }

      // Refresh the data after deletion
      await fetchData();
      setAlert({ message: 'Validation Started successfully', type: 'success' });
      setValidationMessage('Validation Started successfully');
    } catch (error) {
      console.error('Error Validating item:', error);
      setAlert({
        message: 'An error occurred while validatin the item',
        type: 'error',
      });
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };


  const handleDelete = async (itemId) => {

    try {
      const response = await fetch(`${baseUrl}api/phone-generator/clear-numbers/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Refresh the data after deletion
      await fetchData();
      setAlert({ message: 'Item deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting item:', error);
      setAlert({
        message: 'An error occurred while deleting the item',
        type: 'error',
      });
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const closeAlert = () => {
    setAlert({ message: '', type: '' });
  };

  return (
    <div className="rounded-sm border border-stroke  shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          All Numbers - {itemCount}
        </h4>
      </div>

      <div className="grid grid-cols-5 gap-5 py-6 px-4 md:px-6 xl:px-7.5">
        <input
          type="text"
          placeholder="Search here"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <div className="relative z-20 bg-white dark:bg-form-input">
            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                    fill="#637381"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                    fill="#637381"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
            <select
  value={date}
  onChange={(e) => setElectionYear(e.target.value)}
  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
>
  <option value="" disabled className="text-body dark:text-bodydark">
    Filter
  </option>
  {['1992', '1996', '2000', '2000R', '2004', '2008', '2008R', '2012', '2016', '2020', '2024'].map((year) => (
    <option 
      key={year} 
      value={year} 
      className="text-body dark:text-bodydark"
    >
      {year}
    </option>
  ))}
</select>
            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>

        <Link to={'/generate-numbers/'}>
          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
            Generate Numbers
          </button>
        </Link>



       
        <div>
      <button
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        onClick={validateNumbers}
        disabled={loading}
      >
        {loading ? 'Validating...' : 'Validate Numbers'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {validationMessage && <p className="text-green-500 mt-2">{validationMessage}</p>}
    </div>
       
       
       
      <button
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        onClick={() => openDeleteModal('')} >
                    Clear Numbers

</button>


       
      </div>

      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
      <div className="col-span-1 flex items-center">
          <p className="font-medium">Prefix</p>
        </div>
        
        
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Phone Number</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Valid</p>
        </div>

        
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Carrier</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Location</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Type</p>
        </div>
      
  

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Country</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {numbers
  ? numbers.map((number) => (
      <div
        className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 hover:bg-gray"
        key={number?.id || 'default-key'}
      >
        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.prefix ? number.prefix : '-'}
            </p>
          </div>
        </div>

        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.phone_number ? truncateText(number.phone_number, 50) : '-'}
            </p>
          </div>
        </div>

        <div className="col-span-1 flex items-center">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    <p className={`text-sm px-4 py-2 rounded ${number?.valid_number ? 'bg-green text-white' : 'bg-red-600 text-white'} dark:text-white`}>
      {number?.valid_number ? 'Valid' : 'Invalid'}
    </p>
  </div>
</div>


        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.carrier ? truncateText(number.carrier, 50) : '-'}
            </p>
          </div>
        </div>

        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.location ? truncateText(number.location, 50) : '-'}
            </p>
          </div>
        </div>


        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.type ? truncateText(number.type, 50) : '-'}
            </p>
          </div>
        </div>


        <div className="col-span-1 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-black dark:text-white">
              {number?.country_name ? truncateText(number.country_name, 50) : '-'}
            </p>
          </div>
        </div>




        <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <Link to={'/number-details/' + number.id}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                    </button>
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                          fill=""
                        />
                        <path
                          d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                          fill=""
                        />
                      </svg>
                    </button>


                    <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                    </button>
               </div>
                </p>
              </div>
      </div>
    ))
  : null}
      <Pagination
        pagination={{
          page_number: page,
          total_pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          previous: page > 1 ? page - 1 : null,
        }}
        setPage={setPage}
      />

      {/* Render the alert */}
      <Alert2 message={alert.message} type={alert.type} onClose={closeAlert} />


      <ClearConfirmationModal
        isOpen={isModalOpen}
        itemId={itemToDelete}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default AllNumbers;
