import { Component, OnInit } from '@angular/core';
import { TagCommanderService } from 'ngx-tag-commander';


@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss'],
})
export class ShopPageComponent implements OnInit {

  pageItem: Item = {
    id: '1',
    name: 'Shop Item 1',
    price: 20,
    quantity: 0
  };
  cartItems: Array<Item> = [
    {
      id: '2',
      name: 'Shop Item 2',
      price: 90,
      quantity: 2
    }
  ];
  defaultEnv = 'AngularX';
  defaultStoreCurrency = '€';
  isMsgDisplayed = false;

  constructor(private tcService: TagCommanderService) {
      tcService.setTcVars({
      env_template: 'shop',
      env_work: 'dev',
      env_language: 'en',
      user_id: '124',
      user_logged: 'true',
      user_age: '32',
      user_newcustomer: 'false'
    });
   }

  ngOnInit() {
      // this.tcService.reloadAllContainers({});
      // this.tcService.reloadContainer('4056', '12', {
      //   exclusions: ["datastorage", "deduplication"]
      // });
  }

  removeQuantity() {
    if (this.pageItem.quantity > 1) {
      this.pageItem.quantity--;
    }
  }
  addQuantity() {
    this.pageItem.quantity++;
  }
  addToCart() {
    let index = -1;
    this.cartItems.forEach((item, i) => {
      if (item.id === this.pageItem.id) {
        index = i;
      }
    });

    if (index === -1) {
      const item = this.pageItem;
      item['quantity'] = this.pageItem.quantity;
      this.cartItems.push(new Item(
        this.pageItem.id,
        this.pageItem.name,
        this.pageItem.price,
        this.pageItem.quantity
      ));
    } else {
      this.cartItems[index].quantity += this.pageItem.quantity;
    }
    this.pageItem.quantity = 0;
  }
  removeFromCart(index) {
    this.cartItems.splice(index, 1);
    this.tcService.setTcVars({'cartItem': this.cartItems});
  }
  removeQuantityFromCartItem(index) {
    if (this.cartItems[index].quantity === 1) {
      this.removeFromCart(index);
    } else {
      this.cartItems[index].quantity -= 1;
    }
  }
  addQuantityFromCartItem(index) {
    this.cartItems[index].quantity += 1;
  }
  cartGrandTotal () {
    let grandTotal = 0;
    this.cartItems.forEach((cartItem) => {
      grandTotal += cartItem.price * cartItem.quantity;
    });
    return grandTotal;
  }
  checkout() {
    this.cartItems = [];
    this.isMsgDisplayed = true;
  }
}

export class Item {
  id: string;
  name: string;
  price: number;
  quantity: number;

  constructor(id: string, name: string, price: number, quantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}
