'use client';
import ProductPage from '@/components/ProductPage';
import {NewMemberForm} from '@/components/NewMemberForm';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {Separator} from '@/components/ui/separator';
import MemberSection from '@/components/Member';
import React, {useEffect, useState, useMemo} from 'react';
import {getUsers, getProducts, getUser, getAll} from '../../../../sanity/sanity.utils';
import {PortableTextInput, BlockEditor} from 'sanity';
import {PortableTextEditor} from "@sanity/portable-text-editor"
import supabase from '@/supabase/supabaseClient';
import {createEditor, Descendant} from "slate";
import {Slate, Editable, withReact} from "slate-react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { PortableText } from '@portabletext/react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const htmlToPortableText = require('@kaliber/html-to-portable-text')
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
const HtmlToReact = require('html-to-react');
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
// import renderHTML from 'react-render-html';
export default function Test() {
    // const users = await getUsers(); const user = await getUser("wonka-bars");
    // console.log("user"); useEffect(() => {   console.log("user"); }, []); const
    // products = await getProducts("product");
    const editor = useMemo(() => withReact(createEditor()), []);
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty()
    );
    const [convertedText, setConvertedText] = useState("Some default content");
    const [portableText, setPortableText] = useState(null);
    useEffect(() => {
      console.log(editorState);
    }, [editorState]);
    useEffect(() => {
      console.log(convertedText);
      setPortableText(processHTML(convertedText));
    }, [convertedText]);

    function processHTML(html) {
      return removeUndefinedValues(htmlToPortableText(html))
    }

    function removeUndefinedValues(o) {
      return JSON.parse(JSON.stringify(o))
    }
    const [users,
        setUsers] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            try {
                const {data, error} = await supabase
                    .from('users')
                    .select()
                    .contains('content', {isAdmin: true});

                const allItems = await getAll();
                console.log("All items")
                console.log(allItems)

                console.log("Users");
                console.log(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);
    // function ArticleBlockEditor (props) {   const {value, markers} = props
    // const customMarkers = [       {type: 'comment', path: value && value[0] ?
    // [{_key: value[0]._key}] : [], value: 'This must be written better!'}     ]
    // const allMarkers = markers.concat(customMarkers) // [...markers,
    // ...customMarkers] works too   return (     <BlockEditor       {...props}
    //  markers={allMarkers}       renderCustomMarkers={renderCustomMarkers}     />
    //  ) }
    const reactElement = htmlToReactParser.parseWithInstructions(
      convertedText, ()=>true, processingInstructions);
    // const reactElement = htmlToReactParser.parse(convertedText);
    return (
        <main>
            {/* <Slate
                editor={editor}
                initialValue={value}
                onChange={(newValue) => setValue(newValue)}>
                <Editable
                    style={{
                    border: "1px solid black"
                }}/>
            </Slate>
            <div style={{ border: "1px solid black", padding: '2px', minHeight: '400px' }}>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
              />
            </div> */}
          <div>
          <ReactQuill
            theme='snow'
            value={convertedText}
            onChange={setConvertedText}
            style={{minHeight: '300px'}}
          />
          <div>
            {/* <PortableText value={portableText}/> */}
          </div>
          {reactElement}
        </div>
        </main>
    );
}