type ISkeletonLoaderProps = {
  className: string;
};

const SkeletonLoader = ({ className }: ISkeletonLoaderProps) => {
  return (
    <div className={`${className} overflow-hidden rounded-lg bg-background-100`}>
      <div className="h-full w-full animate-skeleton bg-skeleton" />
    </div>
  );
};

export default SkeletonLoader;
