<script>
  import baseColors from "../../properties/colors/base.json";

  export let step;
  $: visible = step === 1;

  const colors = [
    baseColors.base["green-2"].value,
    baseColors.base["orange-1"].value,
    baseColors.base["red"].value,
    baseColors.base["blue-1"].value,
    baseColors.base["tan-1"].value
  ];
  const names = [
    "Grumpy cat",
    "These are all cakes",
    "Disaster girl",
    "Bernie's mittens",
    "Oregon Trail"
  ];
</script>

<div class="images" style={visible && `height: 100vh`}>
  {#each [0, 1, 2, 3, 4] as i}
    <div class="img-group">
      <div class="label" class:visible-label={visible}>{names[i]}</div>
      <img
        src={`assets/img/internet-screenshots/pic${i + 1}.png`}
        alt="lenna screenshot"
        style={visible && `border: 7px solid ${colors[i]}`}
        class:visible-img={visible}
      />
    </div>
  {/each}
</div>

<style>
  .visible-img {
    height: 200px;
    width: 200px;
  }
  .visible-label {
    display: block !important;
  }
  .img-group {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .label {
    display: none;
    font-size: 16px;
    line-height: 32px;
  }
  img {
    height: 0px;
    width: 0px;
    transition: height 1s, width 1s;
  }
  .img-group:nth-child(1) {
    left: 10%;
    top: 10%;
  }
  .img-group:nth-child(2) {
    left: 45%;
    top: 5%;
  }
  .img-group:nth-child(3) {
    left: 30%;
    top: 40%;
  }
  .img-group:nth-child(4) {
    left: 4%;
    top: 65%;
  }
  .img-group:nth-child(5) {
    left: 55%;
    top: 70%;
  }
</style>
