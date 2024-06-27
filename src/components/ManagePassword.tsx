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
import { selectIsAgency, selectIsAdmin } from "@/store/features/auth/authSlice";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic';
import _ from 'lodash';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
const HtmlToReact = require('html-to-react');
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();
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
  menuList: string;
}

interface SelectDemoProps {
  value: string; 
  onValueChange: (user: string) => void; 
  agents: Agent[],
}

const SelectDemo: React.FC<SelectDemoProps> = ({value, onValueChange, agents}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full rounded px-[30px] text-[13px] leading-none h-full gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
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
              <SelectItem key={"agent" + agent.id} value={String(index)}>{agent.title}{agent.content.isAdmin?"*":""}</SelectItem>
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

const processingInstructions = [
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h1';
    },
    processNode: function (node, children, index) {
      return React.createElement('h1', {key: index, class:"text-2xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h2';
    },
    processNode: function (node, children, index) {
      return React.createElement('h2', {key: index, class:"text-xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h3';
    },
    processNode: function (node, children, index) {
      return React.createElement('h3', {key: index, class:"text-lg"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ol';
    },
    processNode: function (node, children, index) {
      return React.createElement('ol', {key: index, class:"pl-10 list-decimal"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ul';
    },
    processNode: function (node, children, index) {
      return React.createElement('ul', {key: index, class:"pl-10 list-disc md:list-circle lg:list-square"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

export function ManagePassword({ user }:{ user:string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);
  const [formData, setFormData] = useState({
    userid: ""
  });
  const [convertedText, setConvertedText] = useState("");
  const [data, setData] = useState<any>();
  const isAgency = useAppSelector(selectIsAgency);
  const isAdmin = useAppSelector(selectIsAdmin);
  let isSuperUser = user == "super";

  useEffect(() => {
    dispatch(getAgents(isSuperUser));
    if (!isAdmin) {
      setData(agents.find(p=> p.title === user));
      setConvertedText((agents.find(p=> p.title === user)).menuList)
    }
  }, [])

  async function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let temp = _.cloneDeep(data);
    temp.menuList = convertedText;
    try {
      const response = await fetch("/api/auth/menulist", {
        method: "POST",
        body: JSON.stringify(temp),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.ok) {
        toast.success('The menu list has been updated successfully!.');
        dispatch(getAgents(isSuperUser));
      }else{
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  function handleInputChange(v){
    setData(agents[Number(v)]);
    setConvertedText(agents[Number(v)].menuList);
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
            <div className="w-full flex flex-row flex-wrap bg-accent rounded-sm p-6 gap-5 justify-evenly sm:gap-4 h-[440px]">
              <ReactQuill
                theme='snow'
                value={convertedText}
                onChange={setConvertedText}
                className="w-full"
                style={{minHeight: '350px', maxHeight: '350px'}}
              />
            </div>
          <div className="w-full flex flex-row flex-wrap bg-accent rounded-sm p-6 gap-5 justify-start sm:gap-4">
            {isAdmin && 
                <select defaultValue={''} onChange={(e) => handleInputChange(e.target.value)} className="text-[15px] leading-[18.5px] text-[#000000] outline-none px-5 rounded-sm w-3/12 min-w-[128px] h-12">
                  {
                    agents.map((p, index)=> {
                      return (
                        <option value={index}>{p.title}</option>
                      )
                    })
                  }
                </select>
              // <div className="w-3/12 min-w-[128px] h-12">
              //   <SelectDemo value={formData.userid} onValueChange={handleInputChange} agents={agents}/>
              // </div>
            }
            <div className="w-[128px]">
              <Button
                className="bg-[#43daf5] hover:bg-[#f85d5d] w-32 h-12 "
                onClick={onSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
  );
}
