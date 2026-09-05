<template>
  <div class="row">
    <div class="col-xs-12">
      <ControlLabel v-if="name !== ''" :required="required" :name="name" :id="id" :classes="label_classes" />
      <input type="file" class="form-control input-style" accept="image/*" @change="uploadFile" />
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
    name: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "",
    },
    label_classes: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      attFiles: null,
    };
  },
  methods: {
    async resizeAndConvertToJpeg(file) {
      const maxSizeInBytes = 100000; // 100KB
      const maxWidth = 800; // Maximum width for resized images
      const maxHeight = 800; // Maximum height for resized images

      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
          const width = img.width;
          const height = img.height;

          // Resize the image if needed
          let newWidth = width;
          let newHeight = height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              newHeight = (height * maxWidth) / width;
              newWidth = maxWidth;
            } else {
              newWidth = (width * maxHeight) / height;
              newHeight = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Compress the canvas content to Blob until it fits the 50KB limit
          let blob = await this.compressToSize(canvas, maxSizeInBytes);

          // Get the file extension from the original file
          const fileExtension = file.name.split(".").pop();

          // Append the original file extension to the resized Blob
          const resizedBlob = new Blob([blob], { type: `image/${fileExtension}` });

          // Convert Blob to File and resolve
          const imgFile = new File([resizedBlob], file.name, { type: "image/png" });
          resolve(imgFile);
        };
      });
    },

    async compressToSize(canvas, maxSizeInBytes) {
      let quality = 0.9;
      let compressedBlob = null;

      while (quality > 0.1) {
        compressedBlob = await this.getBlobFromCanvas(canvas, quality);
        if (compressedBlob.size <= maxSizeInBytes) {
          return compressedBlob;
        }
        quality -= 0.1;
      }

      console.warn("Image compression reached minimum quality without fitting the size limit.");
      return compressedBlob;
    },

    async getBlobFromCanvas(canvas, quality) {
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      });
    },

    async uploadFile(e) {
      this.attFiles = e.target.files;
      let tmp = [];
      let arr = Array.from(this.attFiles);
      for (let i = 0; i < arr.length; i++) {
        let compress = await this.resizeAndConvertToJpeg(arr[i]);
        tmp.push(compress);
      }
      this.attFiles = tmp;
      this.$emit("uploadFile", this.attFiles);
    },
  },
};
</script>
