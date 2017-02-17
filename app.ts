import {
    Component,
    EventEmitter
} from 'angular2/core';

import {bootstrap} from 'angular2/platform/browser';


/**
 * Provides a `Product` object
 */
class Product {
    constructor(
        public sku:string,
        public name:string,
        public imageUrl:string,
        public department:string[],
        public price:number) {
    }
}

/**
 *
 */
@Component({
    selector: 'products-list',
    directives: [],
    inputs: ['productList'],
    outputs: ['onProductSelected'],
    template: `
    <div class='ui items'>
        <product-row
            *ngFor='#myProduct of productList'
            [product] = 'myProduct'
            (click) = 'clicked(myProduct)'
            [class.selected] = 'isSelected(myProduct)'>
        </product-row>
    </div>
    `
})


class ProductsList {

    /**
     * @input - productList - the Product[] passed to us
     */
    productList: Product[];


    /**
     * @output onProductSelected - outputs the current
     * Product whenever a new Product is selected
     */
    onProductSelected:EventEmitter<Product>;

    /**
     * @property  currentProduct - local state containing  the
     * currently selected Product
     * ( local component state )
     */
    currentProduct:Product;


    constructor() {
        this.onProductSelected = new EventEmitter();
    }

    clicked(product: Product): void {
        this.currentProduct = product;
        this.onProductSelected.emit(product);
    }

    isSelected(product: Product): boolean {
        if (!product || !this.currentProduct) {
            return false;
        }
        return product.sku === this.currentProduct.sku;
    }

}


/**
 * @InventoryApp: the top-level component for our application
 */
@Component({
    selector: 'inventory-app',
    directives: [ProductsList],
    template: `
  <div class="inventory-app">
    <products-list
      [productList]="products"
      (onProductSelected)="productWasSelected($event)">
    </products-list>
  </div>
  `
})

class InventoryApp {

    products: Product[];

    constructor() {
        this.products = [
            new Product(
                'NICEHAT',
                'A nice black hat',
                '/resources/images/products/black-hat.jpg',
                ['Men', 'Accessories', 'Hats'],
                20.0),

            new Product(
                'MYSHOES',
                'Black Nikes',
                '/resources/images/products/black-shoes.jpg',
                ['Men', 'Shoes', 'Running'],
                64.99),

            new Product(
                'COAT',
                'Warm Coat',
                '/resources/images/products/blue-jacket.jpg',
                ['Women', 'Jackets', 'Out'],
                54.99),
        ]
    }

    productWasSelected(product:Product):void {
        console.log('Product selected: ', product);
    }
}


bootstrap(InventoryApp);
