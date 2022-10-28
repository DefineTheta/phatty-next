type ISkeletonLoaderProps = {
  className: string;
};

const SkeletonLoader = ({ className }: ISkeletonLoaderProps) => {
  return (
    <div className={`${className} bg-background-100 rounded-lg overflow-hidden`}>
      <div className="w-full h-full bg-skeleton animate-skeleton" />
    </div>
  );
};

export default SkeletonLoader;
