function BookingTimeline({ status }: { status: string }) {
  const steps = ["pending", "accepted", "completed"];

  const getStepIndex = (current: string) => {
    return steps.indexOf(current);
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex items-center gap-4 mt-3">

      {steps.map((step, index) => (
        <div key={step} className="flex items-center">

          {/* Circle */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${
                index <= currentIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
          >
            {index + 1}
          </div>

          {/* Label */}
          <span className="ml-2 capitalize text-sm">
            {step}
          </span>

          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-1 mx-2
                ${
                  index < currentIndex
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
            />
          )}
        </div>
      ))}

      {status === "cancelled" && (
        <span className="text-red-600 font-semibold ml-4">
          ❌ Cancelled
        </span>
      )}

      {status === "rejected" && (
        <span className="text-red-600 font-semibold ml-4">
          ❌ Rejected
        </span>
      )}
    </div>
  );
}

export default BookingTimeline;