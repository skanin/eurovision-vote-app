import React from 'react';
import './Range.css';

interface RangeProps {
	label: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Range(props: RangeProps) {
    const [value, setValue] = React.useState(props.value);
	const { label, min, max, step, onChange } = props;

	const marks = [];
	for (let i = min; i <= max; i += step) {
		marks.push(i);
	}

	const datalistId = `range-marks-${label}`;

	return (
		<div className='range-container'>
			<label className='range-label'>{label}</label>
			<input
				type='range'
				className='range-input'
				min={min}
				max={max}
				step={step}
				defaultValue={props.value}
                onChange={(e) => { 
                    setValue(parseInt(e.target.value));
                    onChange(e);
                }}
                list={datalistId}
                name={label}
			/>
			<datalist id={datalistId}>
				{marks.map((mark) => (
					<option key={mark} value={mark} />
				))}
			</datalist>
			<div className='range-value'>{value}</div>
		</div>
	);
}

export default Range;
