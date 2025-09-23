import { NumericFormat } from 'react-number-format'

type InputProps = {
    className?: string;
    value?: number,
    onChange: (number: number) => void
};
export default function InputNumber({
    className = '',
    value,
    onChange
}: InputProps) {

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\./g, "");
        const newValue = Number(rawValue) || 0;
        onChange(newValue)
    }
    return (
        <NumericFormat
            value={value}
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
            onChange={e => handleChange(e)}
        />
    )
}
