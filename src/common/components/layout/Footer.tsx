import Image from 'next/image';
import Container from './Container';

const Footer = () => {
  return (
    <div className="mt-60 flex w-full flex-row justify-center bg-background-200 py-24">
      <Container>
        <div className="flex flex-row items-center justify-between">
          <a>
            <Image src="/img/logo-light.png" alt="Logo" width="140px" height="36px" />
          </a>
          <div className="items-cente flex flex-row gap-x-8">
            <a
              href="https://twitter.com/Phattywallet"
              target="_blank"
              rel="noopener nofollow noreferrer"
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24" className="fill-text-100">
                <title>icon/twitter</title>
                <desc>Created with Sketch.</desc>
                <g id="icon/twitter" strokeWidth="1" fillRule="evenodd">
                  <path
                    d="M22,5.92338012 C21.264375,6.24956739 20.473125,6.47014997 19.643125,6.56950586 C20.490625,6.06147856 21.14125,5.2578831 21.4475,4.29994232 C20.655,4.76985195 19.77625,5.11103634 18.841875,5.29537589 C18.093125,4.49802923 17.026875,4 15.846875,4 C13.580625,4 11.74375,5.83652182 11.74375,8.10233609 C11.74375,8.42352432 11.78,8.73658912 11.85,9.03715632 C8.439375,8.86593924 5.41625,7.23250336 3.3925,4.75048068 C3.039375,5.35661411 2.836875,6.06147856 2.836875,6.813209 C2.836875,8.23606037 3.56125,9.49206883 4.661875,10.2275524 C3.989375,10.2063065 3.356875,10.0219669 2.80375,9.71452605 C2.803125,9.73202269 2.803125,9.74889444 2.803125,9.76639108 C2.803125,11.7541338 4.2175,13.41194 6.095,13.7887425 C5.750625,13.8824745 5.388125,13.9324649 5.01375,13.9324649 C4.749375,13.9324649 4.4925,13.9068448 4.241875,13.859354 C4.76375,15.4890406 6.279375,16.6750625 8.075,16.7081811 C6.670625,17.8085945 4.90125,18.4640934 2.97875,18.4640934 C2.6475,18.4640934 2.32125,18.4447222 2,18.4072294 C3.815625,19.5707556 5.9725,20.25 8.29,20.25 C15.8375,20.25 19.964375,13.9987022 19.964375,8.57786964 C19.964375,8.39977889 19.960625,8.2229379 19.9525,8.04672178 C20.754375,7.46870794 21.45,6.74634686 22,5.92338012"
                    id="icon-twitter"
                  ></path>
                </g>
              </svg>
            </a>
            <a href="https://t.me/phattycrypto" target="_blank" rel="noopener nofollow noreferrer">
              <svg width="24px" height="24px" viewBox="0 0 24 24" className="fill-text-100">
                <title>icon/telegram</title>
                <desc>Created with Sketch.</desc>
                <g id="icon/telegram" strokeWidth="1" fillRule="evenodd">
                  <path
                    d="M12,21.5833333 C6.70727115,21.5833333 2.41666667,17.2927289 2.41666667,12 C2.41666667,6.70727115 6.70727115,2.41666667 12,2.41666667 C17.2927289,2.41666667 21.5833333,6.70727115 21.5833333,12 C21.5833333,17.2927289 17.2927289,21.5833333 12,21.5833333 Z M6.15065447,11.6217419 C6.04874588,11.6622152 5.96689911,11.7412285 5.92286192,11.8416485 C5.83044384,12.0523936 5.92636682,12.2981559 6.1371119,12.390574 L8.45181577,13.4056415 C8.56971142,13.4573423 8.65708896,13.5606359 8.68852811,13.6854715 L9.35582777,16.3351224 C9.37368768,16.4060389 9.40989785,16.4710057 9.46081971,16.5234946 C9.62105401,16.6886598 9.88484247,16.6926571 10.0500077,16.5324228 L11.0899512,15.5235265 C11.2338682,15.3839061 11.4568211,15.3665934 11.6205665,15.4823231 L13.7392584,16.9797436 C13.7859222,17.012724 13.838871,17.0357537 13.8948134,17.0474012 C14.1201008,17.094307 14.3407571,16.9497001 14.3876629,16.7244126 L16.1305293,8.3534675 C16.1471613,8.27358448 16.1399724,8.19057613 16.1098546,8.11474185 C16.0249159,7.90087272 15.7826842,7.79635399 15.5688151,7.88129272 L6.15065447,11.6217419 Z"
                    id="Shape"
                  ></path>
                </g>
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
