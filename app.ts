import {Component, EventEmitter, NgModule} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";

/**
 * Provides a `Product` object
 */
class Product {
  constructor(public sku: string,
              public name: string,
              public imageUrl: string,
              public department: string[],
              public price: number) {
  }
}


@Component({
  selector: 'product-row',
  inputs: ['product'],
  host: {
    'class': 'item'
  },
  template: `
    <product-image [product]="product"></product-image>
    <div class="content">
      <div class="header">{{product.name}}</div>
      <div class="meta">
        <div class="product-sku">{{product.sku}}</div>
      </div>
      <div class="description">
        <product-department [product]="product"></product-department>
      </div>
    </div>
    <price-display [price]="product.price"></price-display>
  `
})
class ProductRow {
  product: Product;
}

@Component({
  selector: 'product-image',
  inputs: ['product'],
  host: {
    'class': 'ui small image'
  },
  template: `<img class="product-image" [src]="product.imageUrl" src="#">`
})
class ProductImage {
  product: Product;
}

@Component({
  selector: 'price-display',
  inputs: ['price'],
  template: `<div class="price-display">{{price}} dollars</div>`
})
class PriceDisplay {
  price: number;
}

@Component({
  selector: 'product-department',
  inputs: ['product'],
  template: `
    <div class="product-department">
      <span *ngFor="let name of product.department; let i = index">
        <a href="#">{{name}}</a>
        <span>{{(i < product.department.length-1) ? '>' : ''}}</span>
      </span>
    </div>
  `
})
class ProductDepartment {
  product: Product;
}

@Component({
  selector: 'products-list',
  inputs: ['productList'],
  outputs: ['onProductSelected'],
  template: `
    <div class='ui items'>
        <product-row
            *ngFor='let myProduct of productList'
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
  onProductSelected: EventEmitter<Product>;

  /**
   * @property  currentProduct - local state containing  the
   * currently selected Product
   * ( local component state )
   */
  currentProduct: Product;


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

  productWasSelected(product: Product): void {
    console.log('Product selected: ', product);
  }
}

@NgModule({
  declarations: [
      InventoryApp,
      ProductsList,
      ProductRow,
      ProductImage,
      ProductDepartment,
      PriceDisplay
  ],
  imports: [BrowserModule],
  bootstrap: [InventoryApp]
})
class InventoryAppModule {

}

platformBrowserDynamic().bootstrapModule(InventoryAppModule);
