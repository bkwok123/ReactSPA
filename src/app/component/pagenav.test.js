import DOM from './domelement.js'
import City from './city.js'
import Account, {AccountController} from './account.js'

// Reference: https://jestjs.io/docs/en/using-matchers
test('Check the AppElement class instantiation1', () => {

    const el = new DOM.AppElement ("k1");
    expect(el.key).toBe("k1");
    expect(el.element).toBe(null);
});

test('Check the AppElement class getElement1 method', () => {
    
    const el = new DOM.AppElement ("k1");
    const el1 = el.getElement("div");
    const el2 = document.createElement("div");
    expect(el1).toEqual(el2);

    const el3 = new DOM.AppElement ("k2");
    const el4 = el.getElement("button");
    const el5 = document.createElement("button");    
    expect(el4).toEqual(el5);
});

test('Check the DisplayPanel class instantiation2', () => {

    const el = new DOM.DisplayPanel ("k1");
    expect(el.key).toBe("k1");
    expect(el.element).toBe(null);
    expect(el.updateObj).toBe(null);
});

test('Check the createDisplayPanel function', () => {
    
    let obj = document.createElement("div");
    let panel = DOM.htmlEl.createDisplayPanel(obj);
    expect(obj.children.length).toEqual(2); 
    expect(panel).toEqual(obj);   
    expect(panel.nodeName).toEqual("DIV");      
    expect(panel.children[0].nodeName).toEqual("LABEL");
    expect(panel.children[1].nodeName).toEqual("UL");
});