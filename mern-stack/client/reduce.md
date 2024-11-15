/_ ------------------------------------------------------------- _/

    /*

công dụng reduce

1. tính tổng(tổng số, tổng giá trị ....)
2. chuyển mảng thành một đối tượng
3. thực hiện các phép tính toán phức tạp
   \*/


    /*

cú pháp của reduce
array.reduce((accumulator, currentValue, currentIndex, array) => {}, initialValue)

1. accumulator: giá trị tích lũy (gía trị mà bạn muốn tính toán qua từng vòng lặp). Nó bắt đầu từ
   initialValue và được cập nhật sau mỗi lần lặp
2. currentValue: giá trị của phần tử hiện tại trong mảng sau mỗi lần lặp
3. currentIndex: chỉ số của phần tử hiện tại trong mảng
4. array: mảng được duyệt
   \*/


    const numbers = [1, 2, 3, 4, 5];

    // let sum = 0; // initialValue
    // for (let i = 0; i < numbers.length; i++) {
    // 	sum += numbers[i]; // accumulator
    // 	// numbers[i] // currentValue
    // 	// i // currentIndex
    // 	// numbers // array
    // }

    // console.log(sum);

    const total1 = numbers.reduce((accumulator, currentValue) => {
    	// vòng lặp 1: accumulator = 0, currentValue = 1 => return 0 + 1 = 1
    	// vòng lặp 2: accumulator = 1, currentValue = 2 => return 1 + 2 = 3
    	// vòng lặp 3: accumulator = 3, currentValue = 3 => return 3 + 3 = 6
    	// vòng lặp 4: accumulator = 6, currentValue = 4 => return 6 + 4 = 10
    	// vòng lặp 5: accumulator = 10, currentValue = 5 => return 10 + 5 = 15
    	return accumulator + currentValue;
    }, 0);

    // chuyển mảng thành một đối tượng với các key là id và value là {id: number, name: string}
    const users = [
    	{ id: 1, name: "A" },
    	{ id: 2, name: "B" },
    	{ id: 3, name: "C" },
    ];

    const resultUsers = users.reduce((accumulator, user) => {
    	accumulator[user.id] = user;
    	return accumulator;
    	// accumulator: là đổi tượng mình xây dựng trong quá trình lặp
    	// user.id: mỗi đối tượng user có thuộc tính id, và ta sử dụng id làm key trong obj
    	// accumulator[user.id] = user; => trở thành accumulator[1] = {id: 1, name: "A"} => {1: {id: 1, name: 'A}}
    	// accumulator[user.id] = user; => trở thành accumulator[2] = {id: 2, name: "B"} => {{1: {id: 1, name: 'A}}, 2: {id: 2, name: 'B'}}
    	// accumulator[user.id] = user; => trở thành accumulator[3] = {id: 3, name: "C"} => {{1: {id: 1, name: 'A}, 2: {id: 2, name: 'B'}, 3: {id: 3, name: 'C'}}
    }, {});
    console.log("🚀 ~ resultUsers ~ resultUsers:", resultUsers);

    /* ------------------------------------------------------------- */