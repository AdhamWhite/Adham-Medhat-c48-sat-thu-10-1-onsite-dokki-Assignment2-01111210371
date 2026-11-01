import { Hourglass } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className='flex justify-center items-center w-full h-screen bg-black opacity-50 z-50 inset-0 fixed'>
      <div>
        <Hourglass
          visible={true}
          height='80'
          width='80'
          ariaLabel='hourglass-loading'
          wrapperStyle={{}}
          wrapperClass=''
          colors={['#306cce', '#72a1ed']}
        />
      </div>
      ,
    </div>
  );
}
