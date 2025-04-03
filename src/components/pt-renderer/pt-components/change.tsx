export default function annotationChange(props: any) {
  const { changeType, children } = props;

  if (changeType == 'isRising') {
    return (
      <span>
        {children} <span className="text-green-600">▲</span>
        <span className="sr-only" aria-hidden>
          increasing
        </span>
      </span>
    );
  }

  if (changeType == 'isDropping') {
    return (
      <span>
        {children} <span className="text-red-600">▼</span>
        <span className="sr-only" aria-hidden>
          decreasing
        </span>
      </span>
    );
  }

  return (
    <span>
      {children} <span className="text-yellow-300">▬</span>
      <span className="sr-only" aria-hidden>
        stable
      </span>
    </span>
  );
}
