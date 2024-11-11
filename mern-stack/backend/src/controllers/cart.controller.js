import { HTTP_STATUS } from '../common/http-status.common.js';
import { TypeRole } from '../common/type.common.js';
import Cart from '../models/cart.model.js';
import { cartService } from '../services/cart.service.js';
import { productService } from '../services/product.service.js';
import { checkUserExist } from '../services/user.service.js';

export const cartController = {
  // add to cart
  addCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, ...product } = body;

    // check userId gửi lên có trùng với userId trong token không
    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    // check user tồn tại hay không
    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }
    // check product tồn tại hay không
    const productExist = await productService.getProductById(product.productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      // tạo mới giỏ hàng
      const newCart = await cartService.createCart(userId, []);

      // thêm sản phẩm vào giỏ hàng
      newCart.carts.push(product);

      // tính tổng tiền
      const total =
        productExist.sale > 0
          ? product.quantity * (productExist.price - productExist.sale)
          : product.quantity * productExist.price;

      newCart.total = total;
      await newCart.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Thêm sản phẩm vào giỏ hàng thành công!',
        success: true,
      });
    }

    // lấy giỏ hàng của user nếu user đã có giỏ hàng
    const { carts } = result;

    // check product tồn tại trong giỏ hàng hay chưa
    const productExitInCarts = carts.filter((item) => item.productId.toString() === product.productId);

    // nếu tồn tại rồi thì cập nhật số lượng
    if (productExitInCarts && productExitInCarts.length > 0) {
      // tìm ra xem có sản phẩm nào trùng màu và size không
      const itemExist = productExitInCarts.find((item) => item.size === product.size && item.color === product.color);
      if (itemExist) {
        itemExist.quantity += product.quantity;
        // tính tổng tiền
        const total =
          productExist.sale > 0
            ? product.quantity * (productExist.price - productExist.sale)
            : product.quantity * productExist.price;
        result.total += total;
        await result.save();
        return res.status(HTTP_STATUS.OK).json({
          message: 'Add to cart successfully',
          success: true,
        });
      } else {
        // thêm sản phẩm vào giỏ hàng
        carts.push(product);

        // tính tổng tiền
        const total =
          productExist.sale > 0
            ? product.quantity * (productExist.price - productExist.sale)
            : product.quantity * productExist.price;
        result.total += total;
        await result.save();

        return res.status(HTTP_STATUS.OK).json({
          message: 'Add to cart successfully',
          success: true,
        });
      }
    }
    // nếu chưa chưa tồn tại thêm mới vào giỏ hàng
    else {
      // thêm sản phẩm vào giỏ hàng
      carts.push(product);

      // tính tổng tiền
      const total =
        productExist.sale > 0
          ? product.quantity * (productExist.price - productExist.sale)
          : product.quantity * productExist.price;

      result.total += total;
      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }
  },

  // get cart by userId
  getCartByUserId: async (req, res) => {
    const { _id, role } = req.user;
    const params = req.query;
    const { statusUser } = params;

    let query = {};
    // kiểm tra role của user vaf check params có là 1 obejct rỗng hay không
    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You do not have permission to access',
        success: false,
      });
    }

    if (statusUser) {
      query = { status: statusUser };
    }

    query = { ...query, userId: _id };
    console.log('🚀 ~ getCartByUserId: ~ query:', query);

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId(query, params);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get cart successfully',
      success: true,
      data: result,
    });
  },

  // get all carts
  getAllCarts: async (req, res) => {
    const { role } = req.user;
    const params = req.query;
    const { statusUser, _limit = 10, _page = 1, q } = params;

    const option = {
      page: parseInt(_page, 10),
      limit: parseInt(_limit, 10),
      populate: [
        {
          path: 'userId',
          select: '_id email avatar fullname phone status',
        },
        { path: 'carts.productId', select: '_id nameProduct price sale images is_deleted status' },
      ],
    };

    let query = {};
    // kiểm tra role của user vaf check params có là 1 obejct rỗng hay không
    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You do not have permission to access',
        success: false,
      });
    }

    if (q) {
      query = {
        ...query,
        // $or: [{ userId: { $regex: new RegExp(q), $options: 'i' } }],
      };
    }

    // lấy tất cả giỏ hàng
    const result = await Cart.paginate(query, option);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all carts successfully',
      success: true,
      ...result,
    });
  },

  // update quantity product in cart
  updateQuantityProductInCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, productId, productIdInCart } = body;
    const { status } = req.query;

    // check userId gửi lên có trùng với userId trong token không
    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    // check user tồn tại hay không
    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }
    // check product tồn tại hay không
    const productExist = await productService.getProductById(productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }
    const { carts } = result;

    // check productInCart tồn tại trong giỏ hàng hay không
    const productInCart = carts.find((item) => item._id.toString() === productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product in cart not found',
        success: false,
      });
    }

    let isMaxQuantity = false;
    if (!status || status === 'increase') {
      // tăng số lượng sản phẩm trong giỏ hàng
      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity += 1;

          // nếu quantity sản phẩm lớn hơn số lượng tồn kho thì không cho tăng nữa
          // lấy ra sizes có size và color giống với sản phẩm trong giỏ hàng
          const sizeExist = productExist.sizes.find((size) => size.size === item.size && size.color === item.color);
          if (sizeExist && sizeExist.quantity < item.quantity) {
            // set lại quantity sản phẩm trong giỏ hàng
            item.quantity -= 1;
            isMaxQuantity = true;
          }
          if (!isMaxQuantity) {
            // tính tổng tiền
            result.total =
              productExist.sale > 0
                ? productExist.price - productExist.sale + result.total
                : productExist.price + result.total;
          }
        }
      });

      if (isMaxQuantity) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'The quantity of product is greater than the quantity in stock',
          success: false,
        });
      }

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Increase quantity product in cart successfully',
        success: true,
      });
    } else {
      // giảm số lượng sản phẩm trong giỏ hàng
      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity -= 1;

          // quantity sản phẩm không thể nhỏ hơn 1
          if (item.quantity < 1) {
            // xóa sản phẩm khỏi giỏ hàng
            result.carts = carts.filter((item) => item._id.toString() !== productIdInCart);
          }

          // tính tổng tiền
          result.total =
            productExist.sale > 0
              ? result.total - (productExist.price - productExist.sale)
              : result.total - productExist.price;
          // nếu tổng tiền nhỏ hơn 0 thì gán bằng 0
          if (result.total < 0) {
            result.total = 0;
          }
        }
      });

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Decrease quantity product in cart successfully',
        success: true,
      });
    }
  },

  // delete product in cart
  deleteProductInCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, productIdInCart } = body;

    // check userId gửi lên có trùng với userId trong token không
    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }
    const { carts } = result;

    // check productInCart tồn tại trong giỏ hàng hay không
    const productInCart = carts.find((item) => item._id.toString() === productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product in cart not found',
        success: false,
      });
    }

    // xóa sản phẩm khỏi giỏ hàng
    result.carts = carts.filter((item) => item._id.toString() !== productIdInCart);

    const productExist = await productService.getProductById(productInCart.productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // tính tổng tiền
    result.total =
      productExist.sale > 0
        ? result.total - (productExist.price - productExist.sale) * productInCart.quantity
        : result.total - productExist.price * productInCart.quantity;
    // nếu tổng tiền nhỏ hơn 0 thì gán bằng 0
    if (result.total < 0) {
      result.total = 0;
    }

    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete product in cart successfully',
      success: true,
    });
  },

  // async to cart
  asyncToCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, carts: cartLocalUser, total: totalLocalUser } = body;

    // check userId gửi lên có trùng với userId trong token không
    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    // check user tồn tại hay không
    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      // tạo mới giỏ hàng
      const newCart = await cartService.createCart(userId, []);

      // thêm sản phẩm vào giỏ hàng
      newCart.carts.push(...cartLocalUser);

      // tính tổng tiền
      newCart.total += totalLocalUser;

      await newCart.save();
      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }

    // lấy giỏ hàng của user nếu user đã có giỏ hàng
    const { carts } = result;

    // đang sai logic
    // carts 1 array
    // cartLocalUser 1 array
    // kiểm tra xem sản phẩm trong giỏ hàng đã tồn tại chưa check productId và size và color
    cartLocalUser.forEach((itemCartLocal) => {
      const itemCartDb = carts.find((item) => item.productId.toString() === itemCartLocal.productId.toString());
      if (itemCartDb) {
        if (itemCartDb.size === itemCartLocal.size && itemCartDb.color === itemCartLocal.color) {
          itemCartDb.quantity += itemCartLocal.quantity;
        } else {
          carts.push(itemCartLocal);
        }
      } else {
        carts.push(itemCartLocal);
      }
    });

    // tính tổng tiền
    result.total += totalLocalUser;

    // thêm sản phẩm vào giỏ hàng
    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Add to cart successfully',
      success: true,
    });
  },
};