import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

// stylesheets
import './CreateRecipe.scss';

// components
import TagItem from './TagItem';
import IngredientItem from './IngredientItem';
import StepItem from './StepItem';
import Helmet from 'react-helmet';
import Header from '../../components/Header/Header';

function CreateRecipe() {
    const navigate = useNavigate();
    const [tags, setTagState] = useState([]);
    const [tag_values, setTagValues] = useState([]);
    const [tag_count, setTagCount] = useState(0);

    const [ingredients, setIngredientState] = useState([]);
    const [ingredient_values, setIngredientValues] = useState([]);
    const [ingredient_count, setIngredientCount] = useState(0);

    const [steps, setStepState] = useState([]);
    const [step_values, setStepValues] = useState([]);
    const [step_count, setStepCount] = useState(0);


    const [tagsInData, setTagsInData] = useState([])


        //Get the tags that are currently in the Database.
        useEffect(()=>{
            fetch('http://localhost:3001/api/tag')
            .then((res)=> res.json())
            .then((data) => setTagsInData(data))
        },[])
    
        useEffect(()=>{
            let list = document.getElementById("tag-values")
            tagsInData.forEach((tagging)=>
            {
                let y = document.createElement('option')
                y.innerText = tagging.name
                list.appendChild(y)
            })
        },[tagsInData])
        /////// This will get the tags from the api and then populate them into the datalist so
        /////// the user has a something to go off of.

    function addTagItem()
    {
        if (tag_count > 3) return;

        setTagState((prev) => [...prev, <TagItem key={tag_count} listId={tag_count} setTagValues={setTagValues}/>]);
        setTagValues(prev => [...prev, null]);
        setTagCount(prev => prev + 1)
    }

    function removeTagItem()
    {
        if (tag_count < 1) return;

        setTagState((prev) => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setTagValues(prev => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setTagCount(prev => prev - 1);
    }

    function addIngredientItem() {
        setIngredientState((prev) => [...prev, <IngredientItem key={ingredient_count} listId={ingredient_count} setIngredientValues={setIngredientValues}/>]);
        setIngredientValues(prev => [...prev, null]);
        setIngredientCount(prev => prev + 1);
    }

    function removeIngredientItem() {
        if (ingredient_count < 1) return;

        setIngredientState((prev) => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setIngredientValues(prev => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setIngredientCount(prev => prev - 1);
    }

    function addStepItem() {
        setStepState((prev) => [...prev, <StepItem key={step_count} listId={step_count} setStepValues={setStepValues}/>]);
        setStepValues(prev => [...prev, null]);
        setStepCount(prev => prev + 1);
    }

    function removeStepItem() {
        if (step_count < 1) return;

        setStepState((prev) => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setStepValues(prev => {
            let arr = [...prev];
            arr.pop();
            return arr;
        })
        setStepCount(prev => prev - 1);
    }

    const [background_image, setBackgroundImage] = useState('none');
    function uploadImage() {  
        const upload = document.getElementById('photo');
        upload.click();
    }

    function displayImage() {
        const upload = document.getElementById('photo');

        if (upload.files.length === 0) return;

        let fr = new FileReader();
        
        fr.onload = function (e) {
            setBackgroundImage(`url(${e.target.result})`);
        }

        fr.readAsDataURL(upload.files[0]);
    }

    async function getRecipeData()
    {
        const data = {}

        // userid - can't be null
        // handled in api

        // title - can't be null
        const title = document.getElementById('title').value;

        // time - can't be null
        const time = [document.getElementById('hours').value,
                        document.getElementById('minutes').value,
                        document.getElementById('seconds').value].join(':');

        // ingredients - can't be null
        const ingredients = ingredient_values.join(':');

        // steps - can't be null
        const steps = step_values.join(':');

        // tags - need to edit to tagids in the future
        const tags = tag_values.join(':');

        // description
        const description = document.getElementById('description').value;

        // image
        const upload = document.getElementById('photo')
        const image = upload.files[0]? upload.files[0] : null

        data['title'] = title;
        data['time'] = time;
        data['ingredients'] = ingredients;
        data['steps'] = steps;
        data['tags'] = tags;
        data['description'] = description;
        data['image'] = image;

        return data;
    }

    async function postRecipe()
    {
        const url = 'http://localhost:3001/api/recipes';
        const data = await getRecipeData();

        const formData = new FormData()
        for (let name in data) {
            formData.append(name,data[name])
        }

        await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'enctype': 'multipart/form-data',
            },
            referrerPolicy: 'no-referrer',
            body: formData
        });

        navigate('/');
    }

    function cancelRecipe() {
        navigate('/');
    }

    return (
            <div className="CreateRecipeContainer">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Recipea</title>
                <meta name="description" content="Recipea Web Application" />
            </Helmet>
            <Header></Header>
            {/* <!-- user can upload image --> */}
            <div className="image-container" style={{backgroundImage: background_image}} onClick={uploadImage}>
                <svg className="upload-img" width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M91 78.65L25.35 13H91V78.65ZM85.8 97.9333L78.8667 91H13V25.1333L6.06665 18.2L12.1333 12.1333L91.8667 91.8666L85.8 97.9333ZM26 73.6666H61.425L52.325 64.5666L48.75 69.3333L39 56.3333L26 73.6666Z" fill="black"/>
                </svg>    
                <p className="upload-text bold">upload</p>
                <input type="file" name="photo" id="photo" accept='image/*' onChange={displayImage} hidden/>
            </div>
            {/* <!-- user can change title and select time --> */}
            <div className="title-time-container">
            <input type="text" name='title' id='title' placeholder='title'></input>

                <div className="time-container">
                    <svg className="clock" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.0834 25.3645L31.7709 30.052C32.1529 30.434 32.3438 30.9118 32.3438 31.4854C32.3438 32.059 32.1529 32.5534 31.7709 32.9687C31.3542 33.3854 30.8591 33.5937 30.2855 33.5937C29.7119 33.5937 29.2174 33.3854 28.8022 32.9687L24.3751 28.5416C23.889 28.0555 23.5244 27.5173 23.2813 26.927C23.0383 26.3368 22.9167 25.6944 22.9167 25V18.75C22.9167 18.1597 23.1167 17.6645 23.5168 17.2645C23.9167 16.8645 24.4112 16.6652 25.0001 16.6666C25.5904 16.6666 26.0855 16.8666 26.4855 17.2666C26.8855 17.6666 27.0848 18.1611 27.0834 18.75V25.3645ZM25.0001 8.33329C25.5904 8.33329 26.0855 8.53329 26.4855 8.93329C26.8855 9.33329 27.0848 9.82774 27.0834 10.4166C27.0834 11.0069 26.8834 11.502 26.4834 11.902C26.0834 12.302 25.589 12.5013 25.0001 12.5C24.4098 12.5 23.9147 12.3 23.5147 11.9C23.1147 11.5 22.9154 11.0055 22.9167 10.4166C22.9167 9.82635 23.1167 9.33121 23.5168 8.93121C23.9167 8.53121 24.4112 8.3319 25.0001 8.33329ZM41.6668 25C41.6668 25.5902 41.4668 26.0854 41.0667 26.4854C40.6668 26.8854 40.1723 27.0847 39.5834 27.0833C38.9931 27.0833 38.498 26.8833 38.098 26.4833C37.698 26.0833 37.4987 25.5889 37.5001 25C37.5001 24.4097 37.7001 23.9145 38.1001 23.5145C38.5001 23.1145 38.9945 22.9152 39.5834 22.9166C40.1737 22.9166 40.6688 23.1166 41.0688 23.5166C41.4688 23.9166 41.6681 24.4111 41.6668 25ZM25.0001 37.5C25.5904 37.5 26.0855 37.7 26.4855 38.1C26.8855 38.5 27.0848 38.9944 27.0834 39.5833C27.0834 40.1736 26.8834 40.6687 26.4834 41.0687C26.0834 41.4687 25.589 41.668 25.0001 41.6666C24.4098 41.6666 23.9147 41.4666 23.5147 41.0666C23.1147 40.6666 22.9154 40.1722 22.9167 39.5833C22.9167 38.993 23.1167 38.4979 23.5168 38.0979C23.9167 37.6979 24.4112 37.4986 25.0001 37.5ZM12.5001 25C12.5001 25.5902 12.3001 26.0854 11.9001 26.4854C11.5001 26.8854 11.0056 27.0847 10.4167 27.0833C9.82647 27.0833 9.33133 26.8833 8.93133 26.4833C8.53133 26.0833 8.33203 25.5889 8.33342 25C8.33342 24.4097 8.53342 23.9145 8.93342 23.5145C9.33342 23.1145 9.82786 22.9152 10.4167 22.9166C11.007 22.9166 11.5022 23.1166 11.9022 23.5166C12.3022 23.9166 12.5015 24.4111 12.5001 25ZM25.0001 45.8333C22.1181 45.8333 19.4098 45.2861 16.8751 44.1916C14.3404 43.0972 12.1355 41.6132 10.2605 39.7395C8.3855 37.8645 6.90147 35.6597 5.80842 33.125C4.71536 30.5902 4.16814 27.8819 4.16675 25C4.16675 22.118 4.71397 19.4097 5.80842 16.875C6.90286 14.3402 8.38689 12.1354 10.2605 10.2604C12.1355 8.38538 14.3404 6.90135 16.8751 5.80829C19.4098 4.71524 22.1181 4.16801 25.0001 4.16663C27.882 4.16663 30.5904 4.71385 33.1251 5.80829C35.6598 6.90274 37.8647 8.38677 39.7397 10.2604C41.6147 12.1354 43.0994 14.3402 44.1938 16.875C45.2883 19.4097 45.8348 22.118 45.8334 25C45.8334 27.8819 45.2862 30.5902 44.1917 33.125C43.0973 35.6597 41.6133 37.8645 39.7397 39.7395C37.8647 41.6145 35.6598 43.0993 33.1251 44.1937C30.5904 45.2882 27.882 45.8347 25.0001 45.8333ZM25.0001 41.6666C29.6529 41.6666 33.5938 40.052 36.823 36.8229C40.0522 33.5937 41.6668 29.6527 41.6668 25C41.6668 20.3472 40.0522 16.4062 36.823 13.177C33.5938 9.94788 29.6529 8.33329 25.0001 8.33329C20.3473 8.33329 16.4063 9.94788 13.1772 13.177C9.948 16.4062 8.33342 20.3472 8.33342 25C8.33342 29.6527 9.948 33.5937 13.1772 36.8229C16.4063 40.052 20.3473 41.6666 25.0001 41.6666Z" fill="black"/>
                    </svg>
                    <p className="time bold">
                        <input type="number" min='0' max='99' defaultValue='00' name='hours' id='hours'/>:
                        <input type="number" min='0' max='60' defaultValue='00' name='minutes' id='minutes'/>:
                        <input type="number" min='0' max='60' defaultValue='00' name='seconds' id='seconds'/>
                    </p>
                </div>
            </div>

            {/* <!-- user enters tags --> */}
            <div className="tag-container">
                <datalist id="tag-values">
                </datalist>

                <div id="tag-container">
                    {/* <TagItem/> */}
                    {tags}
                </div>
                <button className="tag-button" onClick={addTagItem}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3333 28.3334H21.6666V21.6667H28.3333V18.3334H21.6666V11.6667H18.3333V18.3334H11.6666V21.6667H18.3333V28.3334ZM19.9999 36.6667C17.6944 36.6667 15.5277 36.2289 13.4999 35.3534C11.4721 34.4778 9.70825 33.2906 8.20825 31.7917C6.70825 30.2917 5.52103 28.5278 4.64659 26.5C3.77214 24.4723 3.33436 22.3056 3.33325 20C3.33325 17.6945 3.77103 15.5278 4.64659 13.5C5.52214 11.4723 6.70936 9.70837 8.20825 8.20837C9.70825 6.70837 11.4721 5.52115 13.4999 4.64671C15.5277 3.77226 17.6944 3.33449 19.9999 3.33337C22.3055 3.33337 24.4721 3.77115 26.4999 4.64671C28.5277 5.52226 30.2916 6.70949 31.7916 8.20837C33.2916 9.70837 34.4794 11.4723 35.3549 13.5C36.2305 15.5278 36.6677 17.6945 36.6666 20C36.6666 22.3056 36.2288 24.4723 35.3533 26.5C34.4777 28.5278 33.2905 30.2917 31.7916 31.7917C30.2916 33.2917 28.5277 34.4795 26.4999 35.355C24.4721 36.2306 22.3055 36.6678 19.9999 36.6667ZM19.9999 33.3334C23.7221 33.3334 26.8749 32.0417 29.4583 29.4584C32.0416 26.875 33.3333 23.7223 33.3333 20C33.3333 16.2778 32.0416 13.125 29.4583 10.5417C26.8749 7.95837 23.7221 6.66671 19.9999 6.66671C16.2777 6.66671 13.1249 7.95837 10.5416 10.5417C7.95825 13.125 6.66659 16.2778 6.66659 20C6.66659 23.7223 7.95825 26.875 10.5416 29.4584C13.1249 32.0417 16.2777 33.3334 19.9999 33.3334Z" fill="#387285"/>
                    </svg>
                </button>
                <button className='tag-button' onClick={removeTagItem}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 18.3333V21.6667H28.3333V18.3333H11.6666ZM19.9999 3.33334C10.7999 3.33334 3.33325 10.8 3.33325 20C3.33325 29.2 10.7999 36.6667 19.9999 36.6667C29.1999 36.6667 36.6666 29.2 36.6666 20C36.6666 10.8 29.1999 3.33334 19.9999 3.33334ZM19.9999 33.3333C12.6499 33.3333 6.66659 27.35 6.66659 20C6.66659 12.65 12.6499 6.66667 19.9999 6.66667C27.3499 6.66667 33.3333 12.65 33.3333 20C33.3333 27.35 27.3499 33.3333 19.9999 33.3333Z" fill="#387285" />
                    </svg>
                </button>
            </div>

            {/* <!-- create two columns --> */}
            <div className="ingredient-description-container">
                {/* <!-- ingredient list --> */}
                <div className="ingredient-container">
                    <p className="bold">ingredients</p>
                    <ul>
                        {
                            ingredients.map((item) => {
                                return <li>{item}</li>
                            })
                        }
                    </ul>
                    <div>
                        {/* change class name to something more universal */}
                        <button className='tag-button' onClick={addIngredientItem}>
                            <svg className="add-tag" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.3333 28.3334H21.6666V21.6667H28.3333V18.3334H21.6666V11.6667H18.3333V18.3334H11.6666V21.6667H18.3333V28.3334ZM19.9999 36.6667C17.6944 36.6667 15.5277 36.2289 13.4999 35.3534C11.4721 34.4778 9.70825 33.2906 8.20825 31.7917C6.70825 30.2917 5.52103 28.5278 4.64659 26.5C3.77214 24.4723 3.33436 22.3056 3.33325 20C3.33325 17.6945 3.77103 15.5278 4.64659 13.5C5.52214 11.4723 6.70936 9.70837 8.20825 8.20837C9.70825 6.70837 11.4721 5.52115 13.4999 4.64671C15.5277 3.77226 17.6944 3.33449 19.9999 3.33337C22.3055 3.33337 24.4721 3.77115 26.4999 4.64671C28.5277 5.52226 30.2916 6.70949 31.7916 8.20837C33.2916 9.70837 34.4794 11.4723 35.3549 13.5C36.2305 15.5278 36.6677 17.6945 36.6666 20C36.6666 22.3056 36.2288 24.4723 35.3533 26.5C34.4777 28.5278 33.2905 30.2917 31.7916 31.7917C30.2916 33.2917 28.5277 34.4795 26.4999 35.355C24.4721 36.2306 22.3055 36.6678 19.9999 36.6667ZM19.9999 33.3334C23.7221 33.3334 26.8749 32.0417 29.4583 29.4584C32.0416 26.875 33.3333 23.7223 33.3333 20C33.3333 16.2778 32.0416 13.125 29.4583 10.5417C26.8749 7.95837 23.7221 6.66671 19.9999 6.66671C16.2777 6.66671 13.1249 7.95837 10.5416 10.5417C7.95825 13.125 6.66659 16.2778 6.66659 20C6.66659 23.7223 7.95825 26.875 10.5416 29.4584C13.1249 32.0417 16.2777 33.3334 19.9999 33.3334Z" fill="#387285" />
                            </svg>
                        </button>
                        <button className='tag-button' onClick={removeIngredientItem}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 18.3333V21.6667H28.3333V18.3333H11.6666ZM19.9999 3.33334C10.7999 3.33334 3.33325 10.8 3.33325 20C3.33325 29.2 10.7999 36.6667 19.9999 36.6667C29.1999 36.6667 36.6666 29.2 36.6666 20C36.6666 10.8 29.1999 3.33334 19.9999 3.33334ZM19.9999 33.3333C12.6499 33.3333 6.66659 27.35 6.66659 20C6.66659 12.65 12.6499 6.66667 19.9999 6.66667C27.3499 6.66667 33.3333 12.65 33.3333 20C33.3333 27.35 27.3499 33.3333 19.9999 33.3333Z" fill="#387285" />
                            </svg>
                        </button>
                    </div>
            </div>

                {/* <!-- description --> */}
                <div className="description-container">
                    <p className="description bold">description</p>
                    <textarea name="description" id="description" cols="30" rows="10"></textarea>
                    {/* <button onClick={_onBoldClick}>BOLD</button> */}
                    {/* <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} /> */}
                </div>
            </div>

            <hr/>

            {/* <!-- add directions for the recipe --> */}
            <div className="steps-container">
                <p className="steps bold">steps</p>
                <ol>
                    {
                        steps.map((item) => {
                            return (<li>{item}</li>);
                        })
                    }
                </ol>
                <button className='tag-button' onClick={addStepItem}>
                    <svg className="add-tag" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3333 28.3334H21.6666V21.6667H28.3333V18.3334H21.6666V11.6667H18.3333V18.3334H11.6666V21.6667H18.3333V28.3334ZM19.9999 36.6667C17.6944 36.6667 15.5277 36.2289 13.4999 35.3534C11.4721 34.4778 9.70825 33.2906 8.20825 31.7917C6.70825 30.2917 5.52103 28.5278 4.64659 26.5C3.77214 24.4723 3.33436 22.3056 3.33325 20C3.33325 17.6945 3.77103 15.5278 4.64659 13.5C5.52214 11.4723 6.70936 9.70837 8.20825 8.20837C9.70825 6.70837 11.4721 5.52115 13.4999 4.64671C15.5277 3.77226 17.6944 3.33449 19.9999 3.33337C22.3055 3.33337 24.4721 3.77115 26.4999 4.64671C28.5277 5.52226 30.2916 6.70949 31.7916 8.20837C33.2916 9.70837 34.4794 11.4723 35.3549 13.5C36.2305 15.5278 36.6677 17.6945 36.6666 20C36.6666 22.3056 36.2288 24.4723 35.3533 26.5C34.4777 28.5278 33.2905 30.2917 31.7916 31.7917C30.2916 33.2917 28.5277 34.4795 26.4999 35.355C24.4721 36.2306 22.3055 36.6678 19.9999 36.6667ZM19.9999 33.3334C23.7221 33.3334 26.8749 32.0417 29.4583 29.4584C32.0416 26.875 33.3333 23.7223 33.3333 20C33.3333 16.2778 32.0416 13.125 29.4583 10.5417C26.8749 7.95837 23.7221 6.66671 19.9999 6.66671C16.2777 6.66671 13.1249 7.95837 10.5416 10.5417C7.95825 13.125 6.66659 16.2778 6.66659 20C6.66659 23.7223 7.95825 26.875 10.5416 29.4584C13.1249 32.0417 16.2777 33.3334 19.9999 33.3334Z" fill="#387285" />
                    </svg>
                </button>
                <button className='tag-button' onClick={removeStepItem}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 18.3333V21.6667H28.3333V18.3333H11.6666ZM19.9999 3.33334C10.7999 3.33334 3.33325 10.8 3.33325 20C3.33325 29.2 10.7999 36.6667 19.9999 36.6667C29.1999 36.6667 36.6666 29.2 36.6666 20C36.6666 10.8 29.1999 3.33334 19.9999 3.33334ZM19.9999 33.3333C12.6499 33.3333 6.66659 27.35 6.66659 20C6.66659 12.65 12.6499 6.66667 19.9999 6.66667C27.3499 6.66667 33.3333 12.65 33.3333 20C33.3333 27.35 27.3499 33.3333 19.9999 33.3333Z" fill="#387285" />
                    </svg>
                </button>
            </div>

            {/* <!-- save (s), cancel (c), or post (p) the recipe --> */}
            <div className="footer">
                <div className="scp-container">
                    {/* <button className="save bold" onClick={saveRecipe}>save</button> */}
                    <button id='cancel-button' onClick={cancelRecipe}>
                        <p>Cancel</p>
                    </button>
                    <button id='post-button' onClick={postRecipe}>
                        <p className="post-button-text">Post</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipe