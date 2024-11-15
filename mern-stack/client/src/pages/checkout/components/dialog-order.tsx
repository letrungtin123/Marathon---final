import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import path from "@/configs/path.config";
import { useNavigate } from "react-router-dom";

interface IDialogModal {
	open: boolean;
	onClose: () => void;
}

const DialogOrder = ({ open, onClose }: IDialogModal) => {
	const navigate = useNavigate();

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="[&>button]:hidden">
				<DialogHeader>
					<DialogTitle>Đặt hàng thành công</DialogTitle>
					<DialogDescription>
						Vui lòng kiểm tra lại thông tin đơn hàng và thanh toán để hoàn tất
						đơn hàng.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex sm:justify-center gap-4 w-full">
					<Button variant={"outline"} onClick={() => navigate(path.home)}>
						Về trang chủ
					</Button>
					<Button onClick={() => navigate(`/order/:userId`)}>
						Quản lý đơn hàng
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DialogOrder;