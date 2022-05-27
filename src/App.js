import axios from 'axios';
import { useState } from 'react';
import './App.css';
import Main from './component/Main';

function App() {

  const [file, setFile] = useState(null);

  const submit = () => {
    console.log("submit start");
    const formData = new FormData();
    Object.values(file).forEach((file) => formData.append('file', file));

    axios({
      method: 'POST',
      url: `https://cloudrecord.ml/bpapi/xls/upload`,
      // url : `http://localhost:8080/xls/upload`,
      data: formData,
      headers: {
          'Content-Type' : 'multipart/form-data' 
      }
    })
    .then((response) => { 
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    })
  }
  const download = () => {
    axios({
        method: 'GET',
        url: `https://cloudrecord.ml/bpapi/xls/download/2`,
        // url : `http://localhost:8080/xls/download/2`,
        responseType: 'blob'
    })
    .then((response) => {
        console.log(response);

        // 다운로드(서버에서 전달 받은 데이터) 받은 바이너리 데이터를 blob으로 변환
        const blob = new Blob([response.data], { type: response.headers['content-type']});
        // blob을 사용해 객체 URL을 생성
        const url = window.URL.createObjectURL(blob);
        // blob 객체 URL을 설정할 링크 생성
        const link = document.createElement("a");
        link.href = url;
        link.style.display = "none";
        link.setAttribute(
            "download",
            `sample.xlsx`
        );
        // body에 link 생성 -> 다운로드 -> 제거
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch((error) => {
        console.log(error);
        for (let log in error) {
            console.log("error log: " + JSON.stringify(log));
        }
    })
  }

  const handleChange = (event) => {
    console.log(event.target.files);
    setFile(event.target.files);

  }

  return (
    <div className='App'>
        <div>
            <form id='formData' type='multipart/form-data'>
                <label htmlFor='file'>엑셀업로드</label>
                <input type='file' id="file" name='file' onChange={handleChange} multiple="multiple"/>
                <button type='button' onClick={submit}>전송</button>
            </form>
        </div>
        <div>
            <button type='button' onClick={download}>다운로드</button>
        </div>
    </div>
  )
}

export default App;
