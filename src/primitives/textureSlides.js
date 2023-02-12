const THREE = require('three');
const shader = require("../shaders/textureSlide.js");
/**
 * Provides a base class object which stores textures and rendering object.
 * 
 * @class
 * @author Alan Wu
 * @return {Zinc.Lines}
 */
const TextureSlides = function (textureIn) {
  (require('./texturePrimitive').TexturePrimitive).call(this, textureIn);
  this.isTextureSlides = true;
  
  /*
   * Create slides
   */
  this.createSlides = slideSettings => {
    if (!this.morph) this.morph = new THREE.Group();
    if (this.texture && this.texture.isReady()) {
      console.log("ready");
      slideSettings.forEach(slide => {
        if (slide.direction && slide.value) {
          const geometry = new THREE.PlaneGeometry( 1, 1 );
          geometry.translate(0.5, 0.5, 0);
          const uniforms = shader.getUniforms();
          uniforms.diffuse.value = this.texture.impl;
          uniforms.depth.value = this.texture.size.depth;
          switch(slide.direction) {
            case "x":
              uniforms.slide.value.set(slide.value, 0, 0);
              break;
            case "y":
              uniforms.slide.value.set(0, slide.value, 0);
              break;
            case "z":
              uniforms.slide.value.set(0, 0, slide.value);
              break;
            default:
              break;
          }
          const options = {
            fs: shader.fs,
            vs: shader.vs,
            uniforms: uniforms,
            glslVersion: shader.glslVersion,
            side: THREE.DoubleSide,
            transparent: false
          };
          const material = this.texture.getMaterial(options);
          material.needsUpdate = true;
          const mesh = new THREE.Mesh( geometry, material );
          this.morph.add(mesh);
          console.log("great");
        }
      });
    }
  }

  /**
   * Get the bounding box of this geometry.
   * 
   * @return {THREE.Box3}.
   */
  this.getBoundingBox = function() {
    if (this.morph && this.morph.children && this.morph.visible &&
      this.boundingBoxUpdateRequired) {
      let first = true;
      this.morph.children.forEach( morph => {
        if (first) {
          this.cachedBoundingBox.setFromBufferAttribute(
            morph.geometry.attributes.position);
          first = false;
        } else {
          this.cachedBoundingBox.expandByObject(morph);
        }
      });
      this.boundingBoxUpdateRequired = false;
      return this.cachedBoundingBox;
    }
    return undefined;
  }
}


TextureSlides.prototype = Object.create((require('./texturePrimitive').TexturePrimitive).prototype);
exports.TextureSlides = TextureSlides;
