-- Cho admin liệt kê file trong bucket (Storage API `list`), để xoá thiệp thì dọn luôn thư mục ảnh/nhạc của thiệp đó.
-- Khách vẫn xem ảnh qua URL public, không cần policy này.
create policy "admin xem danh sách media" on storage.objects
  for select to authenticated
  using (bucket_id = 'invitation-media' and public.is_admin());
