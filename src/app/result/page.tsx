"use client";
import React, { useRef, useState } from "react";
import { Button } from "src/components/button";
import Image from "next/image";
import { STATUSES } from "src/const/status";
import SampleImage from "src/assets/img/sample.png";
import Tesseract from "tesseract.js";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

const Result = () => {
  const [image, setImage] = useState<string>("");
  const [uploadedImage, uploadImage] = useState<File | null>();
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const cropperRef = useRef<ReactCropperElement>(null);

  const courses = [3000, 5000, 10000];

  const OCRImage = () => {
    setText(STATUSES.PENDING);
    var buf = document.querySelector("#target");
    Tesseract.recognize(buf, "jpn").then(function (result) {
      const text = result.data.text.replaceAll(",", "").replaceAll(".", "");
      const nums = text.match(/\d+/g);
      if (nums?.length! < 7) {
        setText(STATUSES.FAILED);
        return;
      }
      console.log(text);
      console.log(nums);
      var res = 0;
      const [course, pay, course2, diff, correctKey, typeSpeed, missNum] = [
        parseInt(nums![0]),
        parseInt(nums![1]),
        parseInt(nums![2]),
        parseInt(nums![3]),
        parseInt(nums![4]),
        parseInt(nums![5]) / 10,
        parseInt(nums![6]),
      ];

      res = pay - course;
      if (Math.abs(res) != diff || course != course2) {
        setText(STATUSES.FAILED);
        return;
      }

      setText(res.toString());
    });
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const selectedImage = e.target.files[0];
    uploadImage(selectedImage);
    setIsOpen(true);
  };

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setImage(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    OCRImage()
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {image ? (
        <Image
          id="target"
          src={image}
          alt="user image"
          width={500}
          height={400}
        />
      ) : (
        <Image
          id="target"
          src={SampleImage}
          alt="sample"
          width={500}
          height={400}
        />
      )}
      <input type="file" onChange={handleInput} accept="image/*" />
      <Button label="トリミング" onClick={()=>{setIsOpen(true)}} />
      <div>{status}</div>
      <div>{text}</div>
      {isOpen && uploadedImage ? (
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Cropper
            style={{ height: 400, width: 500 }}
            aspectRatio={1.7}
            preview=".img-preview"
            src={URL.createObjectURL(uploadedImage)}
            ref={cropperRef}
            viewMode={1}
            guides={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            checkOrientation={false}
          />
          <Button label="crop" onClick={getCropData} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Result;
