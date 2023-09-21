const generate = (shlok)=>{

// const attributes = {fill: 'red', stroke: 'black'};
// const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};

// const svg = textToSVG.getSVG(shlok, options);

const html = `<h1 style="
	height: 100%;
   width: 100%;
   background: #AB3428;
  font-family: 'Calligraffitti', cursive;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: 0.02em;
  text-align: center;
  color: #F9f1cc;
  padding: 20px;
  margin: 0;
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  font-style: normal;
  text-shadow: none;
  transition: background 0.3s ease;
  display: inline-block;
  cursor: pointer;
  }
">
${shlok}
</h1>
`
 return html;
}; 


module.exports = generate;
