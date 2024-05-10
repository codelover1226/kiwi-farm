'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { toast } from 'react-hot-toast';
import React, { forwardRef, useEffect } from "react";
import { JsonObject } from "type-fest";
import {
  getAgents,
  selectAgents
} from "@/store/features/agents/agentsSlice";

import { useAppSelector, useAppDispatch } from "@/store/hooks";

interface Agent {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: JsonObject;
  password: string;
}

interface SelectDemoProps {
  value: string; 
  onValueChange: (user: string) => void; 
  agents: Agent[],
}
const SelectDemo: React.FC<SelectDemoProps> = ({value, onValueChange, agents}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full rounded px-[15px] text-[13px] leading-none h-full gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select an agent…" />
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
            {agents.map((agent, index) => {    
              return (
              <SelectItem key={"agent" + agent.id} value={String(agent.id)}>{agent.title}{agent.content.isAdmin?"*":""}</SelectItem>
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
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  value: string;
}

export function DeleteUserForm({ user }:{ user:string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);
  const [formData, setFormData] = useState({
    userid: ""
  });
  const isSuperUser = user == "super";

  useEffect(() => {
    dispatch(getAgents(isSuperUser));
  }, [])

  async function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/deleteUser", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.ok) {
        toast.success('You deleted the user!.');
        dispatch(getAgents(isSuperUser));
      }else{
        const unit8 = (await response.body.getReader().read()).value;
        const msg = Buffer.from(unit8).toString();
        toast.error('Failed to delete user\n' + response.statusText);
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  function handleInputChange(v){
    console.log(v);
    setFormData({
     ...formData,
      ["userid"]: v
    })
  }
  return (
      <form
        className="flex py-5 mb-0 w-full justify-center lg:px-20 xl:px-40"
      >
        <div className="flex flex-grow md:flex-row flex-wrap text-left  items-center gap-2 px-6">
          <div className="w-full">
            <h2 className="text-xl text-center">Delete Agent</h2>
          </div>
          <div className="w-full flex flex-row flex-wrap bg-accent rounded-sm p-6 gap-5 justify-evenly sm:gap-4">
            <div className="w-2/12 min-w-[128px] h-12">
              <SelectDemo value={formData.userid} onValueChange={handleInputChange} agents={agents}/>
            </div>
            <div className=" w-[128px]">
              <Button
                className="bg-[#ee4848] hover:bg-[#f85d5d] w-32 h-12 "
                onClick={onSubmit}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </form>
  );
}
