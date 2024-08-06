'use client'
import { useMemo, useState } from "react";
import React, { useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css'
import _ from 'lodash';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  getAgents,
  selectAgents
} from "@/store/features/agents/agentsSlice";
const HtmlToReactParser = require('html-to-react').Parser;
const HtmlToReact = require('html-to-react');
import {
  selectUser
} from "@/store/features/auth/authSlice";
const htmlToReactParser = new HtmlToReactParser();
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();

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

export default function MenuList() {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);
  const user = useAppSelector(selectUser);
  const convertedText = useMemo(()=> {
    return user?.menuList;    
  }, [user])

  const reactElement = htmlToReactParser.parseWithInstructions(convertedText, ()=>true, processingInstructions);

  useEffect(() => {
    dispatch(getAgents(true));
  }, [convertedText]);

  return (
    <main className="flex min-h-screen flex-col items-center m-auto">
      
      <div className="mt-16 flex xs:px-5 md:px-10 mx-10 xs:min-w-full md:min-w-[600px] max-w-[600px] justify-left text-left rounded-sm py-16 flex-col border-2 mb-5 border-gray-500">
        {reactElement}
      </div>
    </main>
  );
}