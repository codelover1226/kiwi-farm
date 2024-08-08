import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React, { forwardRef } from "react";
import classnames from 'classnames';

interface SelectDemoProps {
  value: string; 
  onValueChange: (user: string) => void; 
  values: string[],
  placeholder: string,
  className: string,
  disables: string[]
}

export const CustomSelect: React.FC<SelectDemoProps> = ({value, onValueChange, values, placeholder, className, disables}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className={classnames(
        className,
        "inline-flex capitalize items-center justify-between w-full rounded px-[15px] text-[13px] leading-none gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
        )}
      aria-label="Food"
    >
      <Select.Value placeholder={placeholder} className='capitalize'/>
      <Select.Icon className="text-violet11">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex items-start justify-start h-full bg-white text-violet11 cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            {values.map((v, index) => {    
              return (
              <SelectItem key={"select" + v} value={v} className='capitalize' disabled={disables.includes(v)}>{v}</SelectItem>
            )})}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-full bg-white text-violet11 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={classnames(
        'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center ">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  value: string;
}