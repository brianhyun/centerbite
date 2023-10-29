export default function SectionHeading({ heading, description, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium">{heading}</h2>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {action && action}
    </div>
  );
}
