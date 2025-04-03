import { ExternalLink } from 'lucide-react';
import { type Calculator, calclulators } from '.';

export default function MukuruCalculator() {
  return (
    <div
      className="mt-4 rounded-md border border-zinc-300"
      id="#ecocash-calculator"
    >
      <div className="flex items-center justify-between rounded-md bg-zinc-200 p-4">
        <div className="">
          <div className="mb-6 flex items-center gap-x-4">
            <div>
              <label
                htmlFor="currency"
                className="hidden text-sm leading-6 font-medium text-gray-900"
                aria-hidden={true}
              >
                Currency
              </label>
              <select
                id="currency"
                name="Currency"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
                aria-label="Currency"
              >
                <option value="none" selected disabled hidden>
                  Currency
                </option>
                <option value="zig">ZiG</option>
                <option value="usd">USD</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="operation"
                className="hidden text-sm leading-6 font-medium text-gray-900"
                aria-hidden={true}
              >
                Operation
              </label>
              <select
                id="operation"
                name="Operation"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
                aria-label="Operation"
              >
                <option value="none" selected disabled hidden>
                  Operation
                </option>
                <option value="cash-in">Cash In</option>
                <option value="cash-out">Cash Out</option>
                <option value="send-money">Send Money</option>
                <option value="check-balance">Check Balance</option>
                <option value="bill-payment">Bill Payment</option>
              </select>
            </div>
          </div>
          <div className="relative mt-2 mb-6 flex w-full flex-col items-center">
            <label
              htmlFor="amount-range"
              className="mb-2 block text-sm font-medium"
            >
              Amount
            </label>
            <input
              id="labels-range-input"
              type="range"
              value="1000"
              min="100"
              max="1500"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <span className="absolute start-0 -bottom-6 text-sm text-gray-300">
              $1
            </span>
            <span className="absolute start-1/2 -bottom-6 -translate-x-1/2 text-sm text-gray-300 rtl:translate-x-1/2">
              $500
            </span>
            <span className="absolute end-0 -bottom-6 text-sm text-gray-300">
              $100000
            </span>
          </div>
          {/* Signup to enter exact amounts */}
        </div>
        <div>Results</div>
      </div>
      <div className="flex gap-4 p-2">
        <span className="text-xs font-medium">Other&nbsp;Calulators:</span>
        <div className="flex flex-wrap items-center gap-x-4">
          {calclulators.map((calculator: Calculator) => (
            <a
              href={calculator.url}
              key={calculator.name}
              className="flex items-center text-xs text-teal-800 hover:underline"
            >
              {calculator.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
