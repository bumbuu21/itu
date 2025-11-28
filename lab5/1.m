% -----------------------------------------------------------
% Даалгавар 1: Spatial and Intensity Resolution (Слайд-11)
% -----------------------------------------------------------
pkg load image;

img_path = 'your_input_image.tif';
img = imread(img_path);
if size(img, 3) == 3
    img = rgb2gray(img);
end
img = im2double(img); % 0-1 хооронд хөрвүүлэх

% --- Орон Зайн Нягтралыг Багасгах ---
[r, c] = size(img);
% 4 дахин багасгах (1/4 хэмжээ)
img_low_spatial = imresize(img, [r/4, c/4], 'nearest');
% Эхний хэмжээнд буцаан томруулах ('nearest' интерполяци ашиглав)
img_low_spatial_zoom = imresize(img_low_spatial, [r, c], 'nearest');


% --- Эрчмийн Нягтралыг Багасгах (4-бит буюу 16 түвшин) ---
k = 4; % 4 бит
L = 2^k; % 16 түвшин (0-1 хооронд)
% Саарал түвшний утгыг L-ээр үржүүлж, бүхэл хэсгийг аваад, L-д хуваах
img_low_intensity = floor(img * L) / L;

figure('Name', 'Даалгавар 1: Нягтрал');
subplot(1, 3, 1), imshow(img), title('Original (8-bit)');
subplot(1, 3, 2), imshow(img_low_spatial_zoom), title('Low Spatial Resolution (Zoomed)');
subplot(1, 3, 3), imshow(img_low_intensity), title('Low Intensity Resolution (4-bit)');