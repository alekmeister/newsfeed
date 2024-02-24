const button = React.createElement('button',{
    type:"button",
    disabled:true,
    tabIndex:0,
},'increment')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(button);
